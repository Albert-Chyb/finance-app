CREATE TYPE "category_color" AS ENUM('red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose');--> statement-breakpoint
CREATE TYPE "interval_unit" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"color" "category_color",
	CONSTRAINT "categories_name_not_blank" CHECK (length(trim("name")) > 0),
	CONSTRAINT "categories_name_max_length" CHECK (length(trim("name")) <= 50)
);
--> statement-breakpoint
CREATE TABLE "recurring_payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recurring_payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"last_payment_date" date NOT NULL,
	"interval_count" integer NOT NULL,
	"interval_unit" "interval_unit" NOT NULL,
	"category_id" integer NOT NULL,
	"wallet_id" integer NOT NULL,
	"amount" integer NOT NULL,
	CONSTRAINT "recurring_payments_name_not_blank" CHECK (length(trim("name")) > 0),
	CONSTRAINT "recurring_payments_name_max_length" CHECK (length(trim("name")) <= 50),
	CONSTRAINT "interval_count_gt_zero" CHECK ("interval_count" > 0),
	CONSTRAINT "amount_not_equal_to_zero" CHECK ("amount" <> 0)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" integer NOT NULL,
	"wallet_id" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"amount" integer NOT NULL,
	CONSTRAINT "transaction_amount_not_zero" CHECK ("amount" <> 0)
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transfers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_wallet_id" integer NOT NULL,
	"target_wallet_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transfers_amount_greater_than_zero" CHECK ("amount" > 0),
	CONSTRAINT "transfers_source_and_target_wallets_are_different" CHECK ("source_wallet_id" <> "target_wallet_id")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wallets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"initial_balance" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "wallets_name_not_blank" CHECK (length(trim("name")) > 0),
	CONSTRAINT "wallets_name_max_length" CHECK (length(trim("name")) <= 50),
	CONSTRAINT "wallets_initial_balance_greather_or_equal_to_zero" CHECK ("initial_balance" >= 0)
);
--> statement-breakpoint
ALTER TABLE "recurring_payments" ADD CONSTRAINT "recurring_payments_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "recurring_payments" ADD CONSTRAINT "recurring_payments_wallet_id_wallets_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_source_wallet_id_wallets_id_fkey" FOREIGN KEY ("source_wallet_id") REFERENCES "wallets"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_target_wallet_id_wallets_id_fkey" FOREIGN KEY ("target_wallet_id") REFERENCES "wallets"("id");--> statement-breakpoint
CREATE VIEW "monthly_statistics" AS (select "year", "month", "total_income", "total_expenses", "income_count", "expenses_count", "monthly_totals"."income_count" + "monthly_totals"."expenses_count" as "transactions_count", "monthly_totals"."total_income" + "monthly_totals"."total_expenses" as "net_income" from (select extract(year from "date") as "year", extract(month from "date") as "month", 
        coalesce(
            sum(case when "amount" > 0 then "amount" else 0 end), 
            0
        )
     as "total_income", 
        coalesce(
            sum(case when "amount" < 0 then "amount" else 0 end),    
            0
        )
     as "total_expenses", count(case when "amount" > 0 then 1 end) as "income_count", count(case when "amount" < 0 then 1 end) as "expenses_count" from "transactions" group by "year", "month") "monthly_totals");--> statement-breakpoint
CREATE VIEW "wallet_balances" AS (select "id" as "wallet_id", 
    "initial_balance"
    + coalesce((select sum("amount") from "transactions" where "transactions"."wallet_id" = "wallets"."id"), 0)
    + coalesce((select sum("amount") from "transfers" where "transfers"."target_wallet_id" = "wallets"."id"), 0)
    - coalesce((select sum("amount") from "transfers" where "transfers"."source_wallet_id" = "wallets"."id"), 0)
 as "balance" from "wallets");