class UserModel {
    constructor(data) {
      this.uid = data.uid || '';
      this.email = data.email || '';
      this.username = data.username || '';
      this.createdAt = data.createdAt || null;
      this.profilePicture = data.profilePicture || '';
      this.bio = data.bio || '';
      this.passions = data.passions || [];
      this.requests = data.requests || [];
      this.friends = data.friends || [];
      this.posts = data.posts || [];
    }
  
    static fromJson(data) {
      return new UserModel(data);
    }
  }
  
  export default UserModel;