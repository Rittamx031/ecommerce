const redisPubsubService = require('../services/redisPubsub.service');


class InventoryServiceTest {
    constructor(){
        redisPubsubService.subscribe('purchase_events', (channel, message) =>{
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity){
        console.log(`update inventory ${productId} ::: ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();