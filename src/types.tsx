export type Patient = {
    id: number;
    name: string;
    gender: string;
    email: string;
    mobile: string;
    profile_photo: string;
}

export type Note = {
    id: number,
    content: string,
    created_at: string
}
