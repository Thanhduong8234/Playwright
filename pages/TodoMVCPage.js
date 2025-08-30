const BasePage = require('./BasePage');

/**
 * TODO MVC PAGE
 * Page Object cho trang TodoMVC demo
 */
class TodoMVCPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Định nghĩa các selectors
    this.selectors = {
      todoInput: '[placeholder="What needs to be done?"]',
      todoList: '.todo-list',
      todoItem: '.todo-list li',
      todoLabel: '.todo-list li label',
      todoCheckbox: '.todo-list li input[type="checkbox"]',
      editInput: '.todo-list li input.edit',
      deleteButton: '.todo-list li .destroy',
      toggleAll: '.toggle-all',
      clearCompleted: '.clear-completed',
      todoCount: '.todo-count',
      filterAll: '.filters a[href="#/"]',
      filterActive: '.filters a[href="#/active"]',
      filterCompleted: '.filters a[href="#/completed"]',
      footer: '.footer'
    };
    
    // URL trang TodoMVC
    this.url = 'https://demo.playwright.dev/todomvc';
  }

  /**
   * Điều hướng đến trang TodoMVC
   */
  async navigate() {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Thêm todo mới
   * @param {string} todoText - Nội dung todo
   */
  async addTodo(todoText) {
    await this.fillInput(this.selectors.todoInput, todoText);
    await this.pressKey(this.selectors.todoInput, 'Enter');
  }

  /**
   * Thêm nhiều todos
   * @param {string[]} todoTexts - Mảng các nội dung todo
   */
  async addMultipleTodos(todoTexts) {
    for (const todoText of todoTexts) {
      await this.addTodo(todoText);
    }
  }

  /**
   * Lấy số lượng todos
   * @returns {Promise<number>} Số lượng todos
   */
  async getTodoCount() {
    return await this.getElementCount(this.selectors.todoItem);
  }

  /**
   * Lấy danh sách text của tất cả todos
   * @returns {Promise<string[]>} Danh sách text todos
   */
  async getTodoTexts() {
    const todoElements = await this.page.locator(this.selectors.todoLabel).all();
    const todoTexts = [];
    
    for (const element of todoElements) {
      const text = await element.textContent();
      if (text) {
        todoTexts.push(text.trim());
      }
    }
    
    return todoTexts;
  }

  /**
   * Đánh dấu todo theo index là completed
   * @param {number} index - Index của todo (bắt đầu từ 0)
   */
  async completeTodo(index) {
    const todoCheckbox = this.page.locator(this.selectors.todoCheckbox).nth(index);
    await todoCheckbox.check();
  }

  /**
   * Bỏ đánh dấu todo theo index
   * @param {number} index - Index của todo (bắt đầu từ 0)
   */
  async uncompleteTodo(index) {
    const todoCheckbox = this.page.locator(this.selectors.todoCheckbox).nth(index);
    await todoCheckbox.uncheck();
  }

  /**
   * Kiểm tra todo có completed không
   * @param {number} index - Index của todo
   * @returns {Promise<boolean>} True nếu completed
   */
  async isTodoCompleted(index) {
    const todoCheckbox = this.page.locator(this.selectors.todoCheckbox).nth(index);
    return await todoCheckbox.isChecked();
  }

  /**
   * Xóa todo theo index
   * @param {number} index - Index của todo
   */
  async deleteTodo(index) {
    const todoItem = this.page.locator(this.selectors.todoItem).nth(index);
    await todoItem.hover();
    const deleteButton = todoItem.locator(this.selectors.deleteButton);
    await deleteButton.click();
  }

  /**
   * Edit todo theo index
   * @param {number} index - Index của todo
   * @param {string} newText - Text mới
   */
  async editTodo(index, newText) {
    const todoItem = this.page.locator(this.selectors.todoItem).nth(index);
    await todoItem.dblclick();
    
    const editInput = todoItem.locator(this.selectors.editInput);
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Toggle tất cả todos
   */
  async toggleAllTodos() {
    await this.clickElement(this.selectors.toggleAll);
  }

  /**
   * Clear tất cả completed todos
   */
  async clearCompleted() {
    if (await this.isElementVisible(this.selectors.clearCompleted)) {
      await this.clickElement(this.selectors.clearCompleted);
    }
  }

  /**
   * Lấy text hiển thị số lượng todos còn lại
   * @returns {Promise<string>} Text hiển thị count
   */
  async getTodoCountText() {
    if (await this.isElementVisible(this.selectors.todoCount)) {
      return await this.getElementText(this.selectors.todoCount);
    }
    return '';
  }

  /**
   * Filter todos - All
   */
  async filterAll() {
    await this.clickElement(this.selectors.filterAll);
  }

  /**
   * Filter todos - Active
   */
  async filterActive() {
    await this.clickElement(this.selectors.filterActive);
  }

  /**
   * Filter todos - Completed
   */
  async filterCompleted() {
    await this.clickElement(this.selectors.filterCompleted);
  }

  /**
   * Lấy số lượng todos visible hiện tại
   * @returns {Promise<number>} Số lượng todos visible
   */
  async getVisibleTodoCount() {
    const visibleTodos = await this.page.locator(`${this.selectors.todoItem}:visible`).count();
    return visibleTodos;
  }

  /**
   * Kiểm tra footer có hiển thị không
   * @returns {Promise<boolean>} True nếu footer visible
   */
  async isFooterVisible() {
    return await this.isElementVisible(this.selectors.footer);
  }

  /**
   * Lấy thông tin analytics về todos
   * @returns {Promise<Object>} Object chứa thông tin analytics
   */
  async getTodoAnalytics() {
    const analytics = await this.page.evaluate(() => {
      const todos = document.querySelectorAll('.todo-list li');
      const analysis = {
        totalItems: todos.length,
        itemsData: [],
        statistics: {}
      };

      todos.forEach((todo, index) => {
        const label = todo.querySelector('label');
        const isCompleted = todo.querySelector('input[type="checkbox"]').checked;
        
        analysis.itemsData.push({
          index: index + 1,
          text: label ? label.textContent.trim() : '',
          isCompleted: isCompleted,
          elementClasses: todo.className
        });
      });

      // Calculate statistics
      const completedCount = analysis.itemsData.filter(item => item.isCompleted).length;
      const pendingCount = analysis.itemsData.filter(item => !item.isCompleted).length;
      
      analysis.statistics = {
        completedCount,
        pendingCount,
        completionRate: analysis.itemsData.length > 0 
          ? (completedCount / analysis.itemsData.length * 100).toFixed(2) + '%'
          : '0%'
      };

      return analysis;
    });

    return analytics;
  }

  /**
   * Kiểm tra todo có tồn tại với text cụ thể không
   * @param {string} todoText - Text cần tìm
   * @returns {Promise<boolean>} True nếu tồn tại
   */
  async hasTodoWithText(todoText) {
    const todoTexts = await this.getTodoTexts();
    return todoTexts.includes(todoText);
  }

  /**
   * Lấy index của todo theo text
   * @param {string} todoText - Text cần tìm
   * @returns {Promise<number>} Index của todo, -1 nếu không tìm thấy
   */
  async getTodoIndexByText(todoText) {
    const todoTexts = await this.getTodoTexts();
    return todoTexts.indexOf(todoText);
  }
}

module.exports = TodoMVCPage;
