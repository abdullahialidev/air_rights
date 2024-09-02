module SkyTrade::air_rights {

    use std::signer;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // New Resource holding a single Air Rights Parcel
    resource struct AirRightsParcel has key, store {
        id: u64,
        owner: address,
        cubic_feet: u64,
        price_per_cubic_foot: u64,
        is_listed: bool,
    }

    // Struct holding all AirRightsParcel resources for an account
    resource struct AirRightsObject has key {
        parcels: vector<AirRightsParcel>,
    }

    // Resource holding the registry for a particular account
    resource struct AirRightsRegistry has key {
        next_id: u64,
        air_rights: vector<AirRightsObject>,
    }

    // EVENTS  
    #[event]
    struct AirRightsCreatedEvent has drop, store {
        parcel_id: u64,
        owner: address,
        cubic_feet: u64,
        price_per_cubic_foot: u64,
    }

    #[event]
    struct AirRightsTransferredEvent has drop, store {
        from: address,
        to: address,
        parcel_id: u64,
    }

    #[event]
    struct AirRightsListedEvent has drop, store {
        owner: address,
        parcel_id: u64,
        price_per_cubic_foot: u64,
    }

    #[event]
    struct AirRightsDelistedEvent has drop, store {
        owner: address,
        parcel_id: u64,
    }

    // Initialize the contract for the caller account
    public entry fun initialize(account: &signer) {
        let registry = AirRightsRegistry {
            next_id: 0,
            air_rights: vector::empty(),
        };

        move_to(account, registry);
    }

    // Create a new air rights parcel and add to AirRightsObject
    public entry fun create_air_rights(account: &signer, cubic_feet: u64, price_per_cubic_foot: u64) acquires AirRightsRegistry {
        let account_address = signer::address_of(account);
        let registry = borrow_global_mut<AirRightsRegistry>(account_address);

        assert!(cubic_feet > 0, 2);
        assert!(price_per_cubic_foot > 0, 3);

        let parcel_id = registry.next_id;
        registry.next_id = parcel_id + 1;

        let parcel = AirRightsParcel {
            id: parcel_id,
            owner: account_address,
            cubic_feet,
            price_per_cubic_foot,
            is_listed: false,
        };

        let mut air_rights_object = AirRightsObject {
            parcels: vector::empty(),
        };

        vector::push_back(&mut air_rights_object.parcels, parcel);
        vector::push_back(&mut registry.air_rights, air_rights_object);

        let event = AirRightsCreatedEvent {
            parcel_id,
            owner: account_address,
            cubic_feet,
            price_per_cubic_foot,
        };

        event::emit(event);
    }

    // Sell air rights parcel
    public entry fun sell_and_transfer_air_rights(
        from: &signer, 
        buyer: &signer, 
        parcel_id: u64, 
        provided_price: u64
    ) acquires AirRightsRegistry {

        let from_address = signer::address_of(from);
        let buyer_address = signer::address_of(buyer);

        let registry = borrow_global_mut<AirRightsRegistry>(from_address);
        let index = get_parcel_index(&registry.air_rights, parcel_id);
        let parcel = vector::borrow_mut(&mut registry.air_rights, index).parcels;

        assert!(parcel.owner == from_address, 4);
        assert!(parcel.is_listed, 5);  

        let expected_price = parcel.cubic_feet * parcel.price_per_cubic_foot;
        assert!(provided_price == expected_price, 11);

        let payment = coin::withdraw<AptosCoin>(buyer, provided_price);
        coin::deposit<AptosCoin>(from_address, payment);

        parcel.owner = buyer_address;
        parcel.is_listed = false;

        let event = AirRightsTransferredEvent {
            from: from_address,
            to: buyer_address,
            parcel_id,
        };

        event::emit(event);
    }

    // List an air rights parcel for sale
    public entry fun list_air_rights(account: &signer, parcel_id: u64, price_per_cubic_foot: u64) acquires AirRightsRegistry {
        let account_address = signer::address_of(account);
        let registry = borrow_global_mut<AirRightsRegistry>(account_address);

        let index = get_parcel_index(&registry.air_rights, parcel_id);
        let parcel = vector::borrow_mut(&mut registry.air_rights, index).parcels;

        assert!(parcel.owner == account_address, 6);
        assert!(price_per_cubic_foot > 0, 7);

        parcel.is_listed = true;
        parcel.price_per_cubic_foot = price_per_cubic_foot;

        let event = AirRightsListedEvent {
            owner: account_address,
            parcel_id,
            price_per_cubic_foot,
        };

        event::emit(event);
    }

    // Delist an air rights parcel
    public entry fun delist_air_rights(account: &signer, parcel_id: u64) acquires AirRightsRegistry {
        let account_address = signer::address_of(account);
        let registry = borrow_global_mut<AirRightsRegistry>(account_address);

        let index = get_parcel_index(&registry.air_rights, parcel_id);
        let parcel = vector::borrow_mut(&mut registry.air_rights, index).parcels;

        assert!(parcel.owner == account_address, 8);
        assert!(parcel.is_listed, 9);

        parcel.is_listed = false;

        let event = AirRightsDelistedEvent {
            owner: account_address,
            parcel_id,
        };

        event::emit(event);
    }

    // Helper function to get the index of a parcel in a vector
    fun get_parcel_index(air_rights: &vector<AirRightsObject>, parcel_id: u64): u64 {
        let len = vector::length(air_rights);
        let i = 0;

        while (i < len) {
            let parcel = vector::borrow(&air_rights[i].parcels, 0);
            if (parcel.id == parcel_id) {
                return i;
            };
            i = i + 1;
        };

        abort 10 
    }
}
