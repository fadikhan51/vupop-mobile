class UserModel {
    constructor(data) {
      this.uid = data.uid || '';
      this.email = data.email || '';
      this.username = data.username || '';
      this.createdAt = data.createdAt || null;
      this.profilePicture = data.profilePicture || '';
      this.bio = data.bio || '';
      this.followers = data.followers || 0;
      this.following = data.following || 0;
      this.posts = data.posts || 0;
    }
  
    static fromJson(data) {
      return new UserModel(data);
    }
  }
  
  export default UserModel;