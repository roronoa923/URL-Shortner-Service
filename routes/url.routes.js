import express from "express";
import { shortenPostRequestBodySchema } from "../validation/request.validation.js";
import db from "../db/index.js";
import { urltable } from "../model/index.js";
import { nanoid } from "nanoid";
import { ensureAuthentication } from "../middlewares/auth.middleware.js";
import { and, eq } from "drizzle-orm";
const router = express.Router();


router.get("/codes", ensureAuthentication, async function (req, res) {
  const codes = await db
    .select()
    .from(urltable)
    .where(eq(urltable.userId, req.user.id));
  return res.json({ codes });
});

router.post("/shorten", ensureAuthentication, async function (req, res) {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);
  const [result] = await db
    .insert(urltable)
    .values({
      shortCode,
      targetURL: url,
      userId: req.user.id,
    })
    .returning({
      id: urltable.id,
      shortCode: urltable.shortCode,
      targetURL: urltable.targetURL,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
});

router.delete("/:id",ensureAuthentication, async function(req,res) {
  const id = req.params.id
  await db.delete(urltable).where(and(eq(urltable.id,id),eq(urltable.userId,req.user.id)))
  return res.status(200).json({deleted: true})
  
})

router.get("/:shortCode", async function (req, res) {
  const code = req.params.shortCode;
  const [result] = await db
    .select({
      targetURL: urltable.targetURL,
    })
    .from(urltable)
    .where(eq(urltable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Invalid Url" });
  }
  return res.redirect(result.targetURL);
});

export default router;
