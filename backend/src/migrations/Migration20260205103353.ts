import { Migration } from '@mikro-orm/migrations';

export class Migration20260205103353 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "todo" add column "author_id" int not null;`);
    this.addSql(`alter table "todo" add constraint "todo_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "todo" drop constraint "todo_author_id_foreign";`);

    this.addSql(`alter table "todo" drop column "author_id";`);
  }

}
