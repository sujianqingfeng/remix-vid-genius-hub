CREATE TABLE `words` (
	`id` text NOT NULL,
	`sentences` text DEFAULT '[]' NOT NULL,
	`fps` integer DEFAULT 40 NOT NULL,
	`output_file_path` text,
	`job_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `words_id_unique` ON `words` (`id`);--> statement-breakpoint
CREATE INDEX `words_id_idx` ON `words` (`id`);--> statement-breakpoint
DROP TABLE `short_texts`;--> statement-breakpoint
ALTER TABLE `translate_videos` DROP COLUMN `asr_words`;