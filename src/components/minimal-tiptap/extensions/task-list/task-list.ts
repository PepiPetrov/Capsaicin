import { TaskItem as TiptapTaskItem } from "@tiptap/extension-task-item"
import { TaskList as TiptapTaskList } from "@tiptap/extension-task-list"

export const TaskList = TiptapTaskList.extend({
  addOptions() {
    return {
      ...this.parent(),
      defaultLanguage: null,
      HTMLAttributes: {
        class: "list-node",
      },
    }
  },
})

export const TaskItem = TiptapTaskItem.extend({
  renderHTML({ node }) {
    return [
      "li",
      {
        "data-type": "taskItem",
        style: "display: flex; align-items: center; gap: 8px;",
      },
      [
        "input",
        { type: "checkbox", checked: node.attrs.checked ? "checked" : null },
      ],
      ["span", {}, 0], // Ensure text is wrapped and aligned
    ]
  },
})
