import { Request, Response, NextFunction } from "express"
import { argv } from "../argv.js"

const forwardController = async ( req : Request, res : Response, next : NextFunction ) => {
    const upstreamURL = argv.origin + req.originalUrl
    const body = req.method === "GET" || req.method === "HEAD" 
                    ? undefined 
                    : req.body 
        
    const headers = new Headers

    for (const [key, value] of Object.entries(req.headers)) {
        headers.set(key, String(value))
    }

    const upstreamRes = await fetch(upstreamURL, {
            method : req.method,
            headers,
            body,
        })
    
    const responseData = await upstreamRes.json()
    res.status(upstreamRes.status).json(responseData)
}

export default forwardController