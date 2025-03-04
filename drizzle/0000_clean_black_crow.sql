CREATE TABLE `dialogues` (
	`id` text NOT NULL,
	`dialogues` text DEFAULT '[]' NOT NULL,
	`fps` integer DEFAULT 40 NOT NULL,
	`output_file_path` text,
	`job_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dialogues_id_unique` ON `dialogues` (`id`);--> statement-breakpoint
CREATE INDEX `dialogues_id_idx` ON `dialogues` (`id`);--> statement-breakpoint
CREATE TABLE `downloads` (
	`id` text NOT NULL,
	`link` text NOT NULL,
	`type` text NOT NULL,
	`author` text,
	`title` text,
	`view_count_text` text,
	`like_count_text` text,
	`download_url` text,
	`file_path` text,
	`comment_count_text` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `downloads_id_unique` ON `downloads` (`id`);--> statement-breakpoint
CREATE INDEX `downloads_id_idx` ON `downloads` (`id`);--> statement-breakpoint
CREATE TABLE `fill_in_blanks` (
	`id` text NOT NULL,
	`fps` integer DEFAULT 60 NOT NULL,
	`sentences` text DEFAULT '[]' NOT NULL,
	`output_file_path` text,
	`job_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fill_in_blanks_id_unique` ON `fill_in_blanks` (`id`);--> statement-breakpoint
CREATE INDEX `fill_in_blank_id_idx` ON `fill_in_blanks` (`id`);--> statement-breakpoint
CREATE TABLE `general_comments` (
	`id` text NOT NULL,
	`type` text NOT NULL,
	`author` text NOT NULL,
	`type_info` text NOT NULL,
	`source` text NOT NULL,
	`comments` text DEFAULT '[]',
	`comment_pull_at` integer,
	`job_id` text,
	`cover_duration_in_seconds` integer DEFAULT 3 NOT NULL,
	`seconds_for_every_30_words` integer DEFAULT 3 NOT NULL,
	`fps` integer DEFAULT 30 NOT NULL,
	`output_file_path` text,
	`source_file_path` text,
	`audio_path` text,
	`public_audio_path` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `general_comments_id_unique` ON `general_comments` (`id`);--> statement-breakpoint
CREATE INDEX `general_comments_id_idx` ON `general_comments` (`id`);--> statement-breakpoint
CREATE TABLE `short_texts` (
	`id` text NOT NULL,
	`fps` integer DEFAULT 120 NOT NULL,
	`title` text NOT NULL,
	`title_zh` text NOT NULL,
	`short_text` text NOT NULL,
	`short_text_zh` text NOT NULL,
	`little_difficult_words` text DEFAULT '[]',
	`word_transcripts` text DEFAULT '[]',
	`sentence_transcripts` text DEFAULT '[]',
	`direction` integer DEFAULT 0 NOT NULL,
	`audio_file_path` text,
	`cover_file_path` text,
	`output_file_path` text,
	`job_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `short_texts_id_unique` ON `short_texts` (`id`);--> statement-breakpoint
CREATE INDEX `short_texts_id_idx` ON `short_texts` (`id`);--> statement-breakpoint
CREATE TABLE `subtitle_translations` (
	`id` text NOT NULL,
	`title` text DEFAULT '',
	`audio_file_path` text,
	`with_time_words` text DEFAULT '[]',
	`sentences` text DEFAULT '[]',
	`split_sentences` text DEFAULT '[]',
	`translate_video_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subtitle_translations_id_unique` ON `subtitle_translations` (`id`);--> statement-breakpoint
CREATE INDEX `subtitle_translations_id_idx` ON `subtitle_translations` (`id`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text NOT NULL,
	`type` text NOT NULL,
	`job_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`desc` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_id_unique` ON `tasks` (`id`);--> statement-breakpoint
CREATE INDEX `tasks_id_idx` ON `tasks` (`id`);--> statement-breakpoint
CREATE TABLE `translate_comments` (
	`id` text NOT NULL,
	`translated_title` text,
	`download_id` text NOT NULL,
	`comments` text DEFAULT '[]',
	`comment_pull_at` integer,
	`job_id` text,
	`mode` text NOT NULL,
	`cover_duration_in_seconds` integer DEFAULT 3 NOT NULL,
	`seconds_for_every_30_words` integer DEFAULT 3 NOT NULL,
	`fps` integer DEFAULT 30 NOT NULL,
	`output_file_path` text,
	`source_file_path` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translate_comments_id_unique` ON `translate_comments` (`id`);--> statement-breakpoint
CREATE INDEX `translate_comments_id_idx` ON `translate_comments` (`id`);--> statement-breakpoint
CREATE TABLE `translate_videos` (
	`id` text NOT NULL,
	`title` text DEFAULT '',
	`title_zh` text DEFAULT '',
	`source` text NOT NULL,
	`download_id` text,
	`upload_file_path` text,
	`audio_file_path` text,
	`asr_words` text DEFAULT '[]',
	`transcripts` text DEFAULT '[]',
	`output_file_path` text,
	`subtitle_translation_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translate_videos_id_unique` ON `translate_videos` (`id`);--> statement-breakpoint
CREATE INDEX `translate_videos_id_idx` ON `translate_videos` (`id`);