import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const dbUrl = new URL(process.env.DATABASE_URL as string);
dbUrl.searchParams.set('uselibpqcompat', 'true');
const adapter = new PrismaPg({ connectionString: dbUrl.toString() });
const prisma = new PrismaClient({ adapter });

type BookData = { title: string; author: string; publicationYear: number };

const catalog: Record<string, BookData[]> = {
  Fiction: [
    { title: '1984', author: 'George Orwell', publicationYear: 1949 },
    { title: 'Things Fall Apart', author: 'Chinua Achebe', publicationYear: 1958 },
    { title: 'Americanah', author: 'Chimamanda Ngozi Adichie', publicationYear: 2013 },
    { title: 'The Alchemist', author: 'Paulo Coelho', publicationYear: 1988 },
  ],
  Science: [
    { title: 'A Brief History of Time', author: 'Stephen Hawking', publicationYear: 1988 },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', publicationYear: 1976 },
    { title: 'Cosmos', author: 'Carl Sagan', publicationYear: 1980 },
    { title: 'Silent Spring', author: 'Rachel Carson', publicationYear: 1962 },
  ],
  History: [
    { title: 'Sapiens', author: 'Yuval Noah Harari', publicationYear: 2011 },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', publicationYear: 1997 },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', publicationYear: 1994 },
    { title: 'The Silk Roads', author: 'Peter Frankopan', publicationYear: 2015 },
  ],
  Technology: [
    { title: 'Clean Code', author: 'Robert C. Martin', publicationYear: 2008 },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', publicationYear: 1999 },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', publicationYear: 2017 },
    { title: 'Refactoring', author: 'Martin Fowler', publicationYear: 1999 },
  ],
};

async function main() {
  // Clear books first so running the seed twice doesn't create duplicates
  await prisma.book.deleteMany();

  // Sample ISBNs: 978 followed by a zero-padded counter, unique per book
  let isbnCounter = 1;

  for (const [genreName, books] of Object.entries(catalog)) {
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    await prisma.book.createMany({
      data: books.map((book) => ({
        ...book,
        isbn: `978${String(isbnCounter++).padStart(10, '0')}`,
        totalCopies: 3,
        genreId: genre.id,
      })),
    });
  }

  console.log('Seeded 4 genres and 16 books');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });