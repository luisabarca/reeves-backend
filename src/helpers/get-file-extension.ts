export const getFileExtension = (fileType: string) => {
    switch (fileType) {
        case "image/svg+xml":
            return "svg";

        case "image/jpeg":
            return "jpg";

        case "image/png":
            return "png";
    
        default:
            return fileType;
    }
}