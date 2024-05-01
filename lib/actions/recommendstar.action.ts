"use server";
import { connectToDB } from "../mongoose";
import Recommend from "../models/Recommend.model";
export async function getlist() {

}
export async function addtagstar(rename: string[]) {
    try {
        connectToDB();

        for (let i = 0; i < rename.length; i++) {
            const tagname = await Recommend.findOne({ name: rename[i] })
            if (tagname) {
                await tagname.updateOne({ $inc: { restar: 1 } })
            } else {
                await Recommend.create({
                    name: rename[i]
                })
            }
        }

    } catch (error: any) {
        throw new Error(`this is an error ${error.message}`)
    }
}