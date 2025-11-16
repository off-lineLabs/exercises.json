import { readdirSync, Dirent, writeFileSync } from "fs";
import { resolve } from "path";
import { Exercise } from "../types/exercise";

const getDirectories = (folder: string): Array<Dirent> => {
  const subFolders = readdirSync(folder, {
    withFileTypes: true,
  }).filter((dir) => dir.isDirectory());

  return subFolders;
};

const getImageFiles = (exerciseFolder: string): Array<string> => {
  const exercisePath = resolve(`./exercises/${exerciseFolder}`);
  const files = readdirSync(exercisePath, { withFileTypes: true });
  
  return files
    .filter((file) => file.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
    .map((file) => `${exerciseFolder}/${file.name}`)
    .sort();
};

const getExercises = (directories: Array<Dirent>): Array<Exercise> => {
  return directories.map((dir) => {
    const exercisePath = resolve(`./exercises/${dir.name}/exercise.json`);
    const exercise = require(exercisePath);
    
    // Add id and images properties
    return {
      ...exercise,
      id: dir.name,
      images: getImageFiles(dir.name)
    };
  });
};

const createJSONFile = (exercises: Array<Exercise>) => {
  writeFileSync(
    "./exercises.json",
    JSON.stringify({ exercises }, null, 2),
    "utf-8"
  );
};

const directories = getDirectories("./exercises");
const exercises = getExercises(directories);
createJSONFile(exercises);
console.log("Created ./exercises.json file");
