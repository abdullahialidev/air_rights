module SkyTrade::air_rights_test {

    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_account::create_account;
    use aptos_framework::aptos_account::transfer;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use SkyTrade::air_rights;

    #[test(core = @0x1, account_one = @0xCAFE, account_two = @0xBEEF)]
    fun test_initialize_create_sell_air_rights(core: &signer, account_one: &signer, account_two: &signer) {

        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(core);

        create_account(signer::address_of(account_one));
        create_account(signer::address_of(account_two));
        coin::deposit(signer::address_of(account_two), coin::mint(60_000, &mint_cap));

        transfer(account_two, signer::address_of(account_one), 500);
        assert!(coin::balance<AptosCoin>(signer::address_of(account_one)) == 500, 0);

        air_rights::initialize(account_one);

        let cubic_feet = 1000;
        let price_per_cubic_foot = 50;
        let latitude = 40.7128;
        let longitude = -74.0060;
        air_rights::create_air_rights(account_one, cubic_feet, price_per_cubic_foot, latitude, longitude);

        air_rights::list_air_rights(account_one, 0, 100);

        air_rights::sell_and_transfer_air_rights(account_one, account_two, 0, 100_000);

        air_rights::delist_air_rights(account_two, 0);
    }
}
