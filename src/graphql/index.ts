import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import process from "process";
import { BASE_URL } from "../constants";
import { getFileExtension } from "../helpers";
import { getApiImageUrl } from "../helpers";

const filename = fileURLToPath(import.meta.url);
const schemaFile = `${path.dirname(filename)}/schema.graphql`;

type QueryArgs = {
  width: Number;
  height: Number;
  young?: Boolean;
  grayScale?: Boolean;
};

export const typeDefs = fs.readFileSync(schemaFile, {
  encoding: "utf8",
});

export const generateImagePath = (
  { width, height, young, grayScale }: QueryArgs,
  extension = "svg"
) => {
  return `images/keanu-${width}x${height}${young ? "-young" : ""}${
    grayScale ? "-grayscale" : ""
  }.${extension}`;
};

export const resolvers = {
  Query: {
    image: async (_parent: any, args: QueryArgs) => {
      const requestUrl = getApiImageUrl(
        args.width,
        args.height,
        !!args.young,
        !!args.grayScale
      );

      const existingPath = generateImagePath(args);

      // File exists (/images folder) ??
      if (fs.existsSync(path.join(process.cwd(), "src", existingPath))) {
        // URL for existing local cached files.
        return {
          url: `${BASE_URL}/${existingPath}`,
        };
      } else {
        try {
          // Fetch image
          const response = await fetch(requestUrl, {
            method: "GET",
          });

          // No response from API
          if (!response.ok) throw new Error("API is down");

          const data = await response.blob();
          // Get image from blob
          const imageContent = Buffer.from(await data.arrayBuffer());

          const imagePath = generateImagePath(
            args,
            getFileExtension(data.type)
          );

          // Path for image.
          const imageCachePath = path.join(process.cwd(), "src", imagePath);

          // Save it to a file.
          fs.writeFileSync(imageCachePath, imageContent);

          // Return our local image URL.
          return {
            url: `${BASE_URL}/${imagePath}`,
          };
        } catch (error) {
          console.log(error);

          // Fallback to original REST API url.
          return {
            url: requestUrl,
          };
        }
      }
    },
  },
};
