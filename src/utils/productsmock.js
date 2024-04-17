import {faker} from '@faker-js/faker';

export const generateMockProducts = () => {

    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        img: faker.image.url(),
        code: faker.string.alphanumeric(),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        thumbnails: [faker.image.url(), faker.image.url(), faker.image.url()]
    };
   
}
