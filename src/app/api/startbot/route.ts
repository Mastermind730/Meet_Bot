import { NextResponse,NextRequest } from "next/server";
import { startBot } from "@/app/lib/bot";


export  async function POST(
    req:Request
){
    const body=await req.json();
    const {meetLink,email,password}=body;

try {
    if(!meetLink || !email || !password){
        return new NextResponse("missing info",{status:401});
    }

    await startBot(body);
    return new  NextResponse("Bot started succesfully",{status:400})


} catch (error:any) {
    console.log("ERROR_STARTING_BOT",error)
    return new NextResponse("Internal Server Error",{status:500});
}

}