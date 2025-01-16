import ApiService from "../services/ApiService";

export default class ChatController {
  constructor(setChatlog, setStories) {
    this.setChatlog = setChatlog;
    this.setStories = setStories;
  }

  async handleSubmit(input, chatLog) {
    const userMessage = input.trim();
    if (!userMessage) return;

    this.setChatlog((prevChatLog) => [...prevChatLog, { role: "user", message: userMessage }]);

    try {
      const response = await ApiService.post("", { userMessage, chatLog });
      const { message, imageUrl } = response;
      const newMessages = [{ role: "gpt", message }];
      if (imageUrl) {
        newMessages.push({ role: "gpt", message: `Image URL: ${imageUrl}` });
      }
      this.setChatlog((prevChatLog) => [...prevChatLog, ...newMessages]);
    } catch (error) {
      console.error("Error handling form submission:", error);
      this.setChatlog((prevChatLog) => [...prevChatLog, { role: "gpt", message: "Error occurred!" }]);
    }
  }

  async generatePDF(chatLog, requestedPages) {
    try {
      const response = await ApiService.post("generate-pdf", { chatLog, requestedPages });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "storybook.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }
}
