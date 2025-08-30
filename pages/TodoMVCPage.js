const BasePage = require('./BasePage');

/**
 * TODO MVC PAGE
 * Page Object for TodoMVC demo page
 */
class TodoMVCPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors
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
    
    // TodoMVC page URL
    this.url = 'https://demo.playwright.dev/todomvc';
  }

  /**
   * Navigate to TodoMVC page
   */
  async navigate() {
    await this.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Add new todo
   * @param {string} todoText - Todo content
   */
  async addTodo(todoText) {
    await this.fillInput(this.selectors.todoInput, todoText);
    await this.pressKey(this.selectors.todoInput, 'Enter');
  }

  /**
   * Add multiple todos
   * @param {string[]} todoTexts - Array of todo contents
   */
  async addMultipleTodos(todoTexts) {
    for (const todoText of todoTexts) {
      await this.addTodo(todoText);
    }
  }

  /**
   * Get todo count
   * @returns {Promise<number>} Number of todos
   */
  async getTodoCount() {
    return await this.getElementCount(this.selectors.todoItem);
  }

  /**
   * Get list of text for all todos
   * @returns {Promise<string[]>} List of todo texts
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
   * Mark todo by index as completed
   * @param {number} index - Todo index (starting from 0)
   */
  async completeTodo(index) {
    const todoCheckbox = this.page.locator(this.selectors.todoCheckbox).nth(index);
    await todoCheckbox.check();
  }

  /**
   * Unmark todo by index
   * @param {number} index - Todo index (starting from 0)
   */
  async uncompleteTodo(index) {
    const todoCheckbox = this.page.locator(this.selectors.todoCheckbox).nth(index);
    await todoCheckbox.uncheck();
  }

  /**
   * Check if todo is completed
   * @param {number} index - Todo index
   * @returns {Promise<boolean>} True if completed
   */
  async isTodoCompleted(index) {
    const todoCheckbox = this.page.locator(this.selectors.todoCheckbox).nth(index);
    return await todoCheckbox.isChecked();
  }

  /**
   * Delete todo by index
   * @param {number} index - Todo index
   */
  async deleteTodo(index) {
    const todoItem = this.page.locator(this.selectors.todoItem).nth(index);
    await todoItem.hover();
    const deleteButton = todoItem.locator(this.selectors.deleteButton);
    await deleteButton.click();
  }

  /**
   * Edit todo by index
   * @param {number} index - Todo index
   * @param {string} newText - New text
   */
  async editTodo(index, newText) {
    const todoItem = this.page.locator(this.selectors.todoItem).nth(index);
    await todoItem.dblclick();
    
    const editInput = todoItem.locator(this.selectors.editInput);
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Toggle all todos
   */
  async toggleAllTodos() {
    await this.clickElement(this.selectors.toggleAll);
  }

  /**
   * Clear all completed todos
   */
  async clearCompleted() {
    if (await this.isElementVisible(this.selectors.clearCompleted)) {
      await this.clickElement(this.selectors.clearCompleted);
    }
  }

  /**
   * Get text for displaying the remaining todo count
   * @returns {Promise<string>} Text for count
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
   * Get current visible todo count
   * @returns {Promise<number>} Current visible todo count
   */
  async getVisibleTodoCount() {
    const visibleTodos = await this.page.locator(`${this.selectors.todoItem}:visible`).count();
    return visibleTodos;
  }

  /**
   * Check if footer is visible
   * @returns {Promise<boolean>} True if footer visible
   */
  async isFooterVisible() {
    return await this.isElementVisible(this.selectors.footer);
  }

  /**
   * Get analytics for todos
   * @returns {Promise<Object>} Object containing analytics
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
   * Check if todo exists with specific text
   * @param {string} todoText - Text to find
   * @returns {Promise<boolean>} True if exists
   */
  async hasTodoWithText(todoText) {
    const todoTexts = await this.getTodoTexts();
    return todoTexts.includes(todoText);
  }

  /**
   * Get index of todo by text
   * @param {string} todoText - Text to find
   * @returns {Promise<number>} Todo index, -1 if not found
   */
  async getTodoIndexByText(todoText) {
    const todoTexts = await this.getTodoTexts();
    return todoTexts.indexOf(todoText);
  }
}

module.exports = TodoMVCPage;
