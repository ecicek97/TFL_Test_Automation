export const OpenLibraryApi = {
  endpoint:
    process.env.OPENLIBRARY_ENDPOINT ||
    'https://openlibrary.org/api/books?bibkeys=ISBN:0201558025,LCCN:93005405,ISBN:1583762027&format=json',
  responseTimeThresholdMs: 2000,
  expectedResultCount: 3,
  expectedBooks: {
    'ISBN:0201558025': {
      bibKey: 'ISBN:0201558025',
      infoUrl: 'https://openlibrary.org/books/OL1429049M/Concrete_mathematics',
      preview: 'noview',
      previewUrl: 'https://archive.org/details/concretemathemat00grah_444',
      thumbnailUrl: 'https://covers.openlibrary.org/b/id/135182-S.jpg',
      imageFile: 'ISBN_0201558025.jpg',
    },
    'LCCN:93005405': {
      bibKey: 'LCCN:93005405',
      infoUrl: 'https://openlibrary.org/books/OL1397864M/Zen_speaks',
      preview: 'borrow',
      previewUrl: 'https://archive.org/details/zenspeaksshoutso0000caiz',
      thumbnailUrl: 'https://covers.openlibrary.org/b/id/240726-S.jpg',
      imageFile: 'LCCN_93005405.jpg',
    },
    'ISBN:1583762027': {
      bibKey: 'ISBN:1583762027',
      infoUrl: 'https://openlibrary.org/books/OL24980922M/Eat_that_frog!',
      preview: 'borrow',
      previewUrl: 'https://archive.org/details/eatthatfrog21gre00trac',
      thumbnailUrl: 'https://covers.openlibrary.org/b/id/14882287-S.jpg',
      imageFile: 'ISBN_1583762027.jpg',
    },
  },
  fixturesDir: 'api-fixtures/openlibrary',
  thumbnailHost: 'covers.openlibrary.org',
};
