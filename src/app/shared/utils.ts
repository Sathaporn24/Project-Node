import { environment } from "../../environments/environment.development"

export const getImageUrl = (imagePath: string) => {
    return environment.apiBaseUrl + imagePath;
}
