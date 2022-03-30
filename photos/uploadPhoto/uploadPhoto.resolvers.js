import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObjs = [];
        if (caption) {
          const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
          hashtagObjs = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
          console.log(hashtagObjs);
        }
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObjs.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObjs,
              }, // if hastagObj length is greater than 0, connect or create hashtag Obj,
            }),
          },
        });
      }
    ),
  },
};
