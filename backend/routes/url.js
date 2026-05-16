import express from "express"
import Url from "../models/Url.js"
import { nanoid } from "nanoid"

const router = express.Router()

router.post("/shorten", async (req, res) => {
    try {
        const { originalUrl } = req.body

        if (!originalUrl) {
            return res.status(400).json({ message: "Original URL is required" })
        }

        try {
            new URL(originalUrl)
        } catch {
            return res.status(400).json({ message: "Invalid URL" })
        }

        // Checa se a URL já foi encurtada antes
        const existing = await Url.findOne({ originalUrl })
        if (existing) {
            return res.json({ shortUrl: `${process.env.FRONTEND_URL}/${existing.shortId}` })
        }

        let shortId
        let exists = true

        while (exists) {
            shortId = nanoid(8)
            exists = await Url.findOne({ shortId })
        }

        const url = await Url.create({ shortId, originalUrl })
        res.status(201).json({ shortUrl: `${process.env.FRONTEND_URL}/${url.shortId}` })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
})

router.get("/:shortId", async (req, res) => {
    try {
        const { shortId } = req.params
        const url = await Url.findOne({ shortId })
        if (!url) return res.status(404).json({ message: "URL not found" })

        await Url.findOneAndUpdate({ shortId }, { $inc: { clicks: 1 } })

        return res.redirect(url.originalUrl)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
})

export default router