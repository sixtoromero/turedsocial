export class PostsModel {
    public id: number;
    public user_id: string;
    public id_posts: string;
    public title: string;
    public body: string;
    public url: string = '';
    public created_at: Date;
    public isVisible: boolean = false;
}