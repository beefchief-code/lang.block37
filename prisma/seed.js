const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (numUsers = 5, numPlaylists = 10, numTracks = 20) => {
  //5 users
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.displayName(),
  }));
  await prisma.user.createMany({ data: users });

  //20 tracks
  const tracks = Array.from({ length: numTracks }, () => ({
    name: faker.music.songName(),
  }));
  await prisma.track.createMany({ data: tracks });

  //10 playlists
  for (let i = 0; i < numPlaylists; i++) {
    //playlist length 8-20
    const playlistSize = 12;
    const playlistTracks = Array.from({ length: playlistSize }, () => ({
      id: 1 + Math.floor(Math.random() * numTracks),
    }));
    //playlist for random user
    await prisma.playlist.create({
      data: {
        name: faker.word.noun(),
        description: faker.lorem.sentences(2),
        ownerId: 1 + Math.floor(Math.random() * numUsers),
        tracks: { connect: playlistTracks },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
