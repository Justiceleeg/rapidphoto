ALTER TABLE "photo" ADD COLUMN "suggested_tags" text[];--> statement-breakpoint
CREATE INDEX "photo_tags_idx" ON "photo" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "photo_suggested_tags_idx" ON "photo" USING gin ("suggested_tags");