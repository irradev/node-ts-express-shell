import { envs } from "../../config/envs";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";


(async()=> {

    if (!envs.IS_DEV_MODE) {
        console.log('SEEDING ONLY WORKS IN DEV MODE');
        
        return;
    }

    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });

    await main();

    await MongoDatabase.disconnect();
})();
  
const randomBetween0AndX = (x: number) => Math.floor(Math.random() * x);
  
  async function main() {
  
    console.log('Seeding...');
    
    // 0. Borrar todo
    await Promise.all([
        UserModel.deleteMany(),
        ProductModel.deleteMany(),
        CategoryModel.deleteMany(),
    ]);

    // 1. Crear usuarios
    const users = await UserModel.insertMany(seedData.users);

    // 2. Crear categorias
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => ({
            ...category, 
            user: users[randomBetween0AndX(users.length - 1)]._id
        }))
    );

    // 3. Crear productos
    const products = await ProductModel.insertMany(
        seedData.products.map(product => ({
            ...product, 
            user: users[randomBetween0AndX(users.length - 1)]._id,
            category: categories[randomBetween0AndX(categories.length - 1)]._id
        }))
    );
  
    console.log('SEED DONE');
    
  }