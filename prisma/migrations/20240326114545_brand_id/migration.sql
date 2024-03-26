-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL DEFAULT '',
    "total_tokens" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Chat" ("id", "title", "total_tokens") SELECT "id", "title", "total_tokens" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
