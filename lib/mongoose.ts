import mongoose from 'mongoose';
let isConnect=false;
export const connectToDB=async()=>{
mongoose.set('strictQuery',true);
if(!process.env.MONGODB_URL) console.log('mongoose is not connect');
if(isConnect) return console.log('mongoose is running');
try{
    console.log('nextway')
await mongoose.connect('mongodb+srv://tsuser:coyhGwIi7qienZm3@mydb.22gwldi.mongodb.net/?retryWrites=true&w=majority');
isConnect=true
}catch(error){
console.log(error)
}
}