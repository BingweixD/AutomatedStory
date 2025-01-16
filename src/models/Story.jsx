export default class Story {
    constructor(id, title, content) {
      this.id = id || Date.now(); // Default to current timestamp
      this.title = title || "Untitled Story";
      this.content = content || "";
    }
  
    summarize() {
      return `${this.title}: ${this.content.substring(0, 50)}...`;
    }
  }
  