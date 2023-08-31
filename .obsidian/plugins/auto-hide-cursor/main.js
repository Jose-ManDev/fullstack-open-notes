/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoHideCursorPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_CURSOR_SETTINGS = {
  movementThreshold: 3,
  delayTime: 500
};
var HIDE_CURSOR_CLASS = "hide-cursor";
var AutoHideCursorPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.isCursorMoving = false;
    this.handleScrollEvent = () => {
      document.body.classList.add(HIDE_CURSOR_CLASS);
      this.isCursorMoving = false;
    };
    this.handleCursorMovement = (evt) => {
      if (this.hasCursorMovementExceededThreshold(evt)) {
        clearTimeout(this.cursorTimeout);
        document.body.classList.remove(HIDE_CURSOR_CLASS);
        this.isCursorMoving = true;
        this.cursorTimeout = setTimeout(() => {
          document.body.classList.add(HIDE_CURSOR_CLASS);
          this.isCursorMoving = false;
        }, this.settings.delayTime);
      }
    };
  }
  async onload() {
    await this.loadUserSettings();
    this.addSettingTab(new AutoHideCursorSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      this.setEventListeners(document.body);
    });
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        setTimeout(() => {
          this.setEventListeners(activeDocument.body);
        }, 1e3);
      })
    );
  }
  setEventListeners(targetElement) {
    targetElement.removeEventListener(
      "mousemove",
      this.handleCursorMovement,
      { capture: true }
    );
    targetElement.removeEventListener("scroll", this.handleScrollEvent, {
      capture: true
    });
    this.registerDomEvent(
      targetElement,
      "mousemove",
      this.handleCursorMovement,
      { capture: true }
    );
    this.registerDomEvent(targetElement, "scroll", this.handleScrollEvent, {
      capture: true
    });
  }
  async loadUserSettings() {
    this.settings = {
      ...DEFAULT_CURSOR_SETTINGS,
      ...await this.loadData()
    };
  }
  async saveUserSettings() {
    await this.saveData(this.settings);
    this.setEventListeners();
  }
  hasCursorMovementExceededThreshold(evt) {
    const movementThreshold = this.settings.movementThreshold;
    const deltaX = Math.abs(evt.movementX);
    const deltaY = Math.abs(evt.movementY);
    return deltaX > movementThreshold || deltaY > movementThreshold;
  }
};
var AutoHideCursorSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Auto Hide Cursor Settings" });
    new import_obsidian.Setting(containerEl).setName("Movement Threshold (px)").setDesc("Minimum distance to show the cursor again").addSlider((slider) => {
      slider.setLimits(0, 10, 1).setValue(this.plugin.settings.movementThreshold).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.movementThreshold = value;
        await this.plugin.saveUserSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("Hide Delay (ms)").setDesc("Time to hide the cursor after stopping movement").addSlider((slider) => {
      slider.setLimits(200, 1e3, 25).setValue(this.plugin.settings.delayTime).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.delayTime = value;
        await this.plugin.saveUserSettings();
      });
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW50ZXJmYWNlIEN1cnNvclNldHRpbmdzIHtcblx0bW92ZW1lbnRUaHJlc2hvbGQ6IG51bWJlcjtcblx0ZGVsYXlUaW1lOiBudW1iZXI7XG59XG5cbmNvbnN0IERFRkFVTFRfQ1VSU09SX1NFVFRJTkdTOiBDdXJzb3JTZXR0aW5ncyA9IHtcblx0bW92ZW1lbnRUaHJlc2hvbGQ6IDMsXG5cdGRlbGF5VGltZTogNTAwLFxufTtcblxuY29uc3QgSElERV9DVVJTT1JfQ0xBU1MgPSBcImhpZGUtY3Vyc29yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9IaWRlQ3Vyc29yUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcblx0c2V0dGluZ3M6IEN1cnNvclNldHRpbmdzO1xuXHRjdXJzb3JUaW1lb3V0OiBOb2RlSlMuVGltZW91dDtcblx0aXNDdXJzb3JNb3ZpbmcgPSBmYWxzZTtcblxuXHRhc3luYyBvbmxvYWQoKSB7XG5cdFx0YXdhaXQgdGhpcy5sb2FkVXNlclNldHRpbmdzKCk7XG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBBdXRvSGlkZUN1cnNvclNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XG5cdFx0XHR0aGlzLnNldEV2ZW50TGlzdGVuZXJzKGRvY3VtZW50LmJvZHkpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gdG8gc3VwcG9ydCBwb3BvdXQgd2luZG93c1xuXHRcdHRoaXMucmVnaXN0ZXJFdmVudChcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1jaGFuZ2VcIiwgKCkgPT4ge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLnNldEV2ZW50TGlzdGVuZXJzKGFjdGl2ZURvY3VtZW50LmJvZHkpO1xuXHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdH0pXG5cdFx0KTtcblx0fVxuXG5cdHNldEV2ZW50TGlzdGVuZXJzKHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0dGFyZ2V0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuXHRcdFx0XCJtb3VzZW1vdmVcIixcblx0XHRcdHRoaXMuaGFuZGxlQ3Vyc29yTW92ZW1lbnQsXG5cdFx0XHR7IGNhcHR1cmU6IHRydWUgfVxuXHRcdCk7XG5cdFx0dGFyZ2V0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFuZGxlU2Nyb2xsRXZlbnQsIHtcblx0XHRcdGNhcHR1cmU6IHRydWUsXG5cdFx0fSk7XG5cblx0XHR0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LFxuXHRcdFx0XCJtb3VzZW1vdmVcIixcblx0XHRcdHRoaXMuaGFuZGxlQ3Vyc29yTW92ZW1lbnQsXG5cdFx0XHR7IGNhcHR1cmU6IHRydWUgfVxuXHRcdCk7XG5cdFx0dGhpcy5yZWdpc3RlckRvbUV2ZW50KHRhcmdldEVsZW1lbnQsIFwic2Nyb2xsXCIsIHRoaXMuaGFuZGxlU2Nyb2xsRXZlbnQsIHtcblx0XHRcdGNhcHR1cmU6IHRydWUsXG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBsb2FkVXNlclNldHRpbmdzKCkge1xuXHRcdHRoaXMuc2V0dGluZ3MgPSB7XG5cdFx0XHQuLi5ERUZBVUxUX0NVUlNPUl9TRVRUSU5HUyxcblx0XHRcdC4uLihhd2FpdCB0aGlzLmxvYWREYXRhKCkpLFxuXHRcdH07XG5cdH1cblxuXHRhc3luYyBzYXZlVXNlclNldHRpbmdzKCkge1xuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG5cdFx0dGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0aGFuZGxlU2Nyb2xsRXZlbnQgPSAoKSA9PiB7XG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKEhJREVfQ1VSU09SX0NMQVNTKTtcblx0XHR0aGlzLmlzQ3Vyc29yTW92aW5nID0gZmFsc2U7XG5cdH07XG5cblx0aGFuZGxlQ3Vyc29yTW92ZW1lbnQgPSAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0aWYgKHRoaXMuaGFzQ3Vyc29yTW92ZW1lbnRFeGNlZWRlZFRocmVzaG9sZChldnQpKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5jdXJzb3JUaW1lb3V0KTtcblx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShISURFX0NVUlNPUl9DTEFTUyk7XG5cdFx0XHR0aGlzLmlzQ3Vyc29yTW92aW5nID0gdHJ1ZTtcblxuXHRcdFx0dGhpcy5jdXJzb3JUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChISURFX0NVUlNPUl9DTEFTUyk7XG5cdFx0XHRcdHRoaXMuaXNDdXJzb3JNb3ZpbmcgPSBmYWxzZTtcblx0XHRcdH0sIHRoaXMuc2V0dGluZ3MuZGVsYXlUaW1lKTtcblx0XHR9XG5cdH07XG5cblx0aGFzQ3Vyc29yTW92ZW1lbnRFeGNlZWRlZFRocmVzaG9sZChldnQ6IE1vdXNlRXZlbnQpIHtcblx0XHRjb25zdCBtb3ZlbWVudFRocmVzaG9sZCA9IHRoaXMuc2V0dGluZ3MubW92ZW1lbnRUaHJlc2hvbGQ7XG5cdFx0Y29uc3QgZGVsdGFYID0gTWF0aC5hYnMoZXZ0Lm1vdmVtZW50WCk7XG5cdFx0Y29uc3QgZGVsdGFZID0gTWF0aC5hYnMoZXZ0Lm1vdmVtZW50WSk7XG5cdFx0cmV0dXJuIGRlbHRhWCA+IG1vdmVtZW50VGhyZXNob2xkIHx8IGRlbHRhWSA+IG1vdmVtZW50VGhyZXNob2xkO1xuXHR9XG59XG5cbmNsYXNzIEF1dG9IaWRlQ3Vyc29yU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcblx0cGx1Z2luOiBBdXRvSGlkZUN1cnNvclBsdWdpbjtcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBBdXRvSGlkZUN1cnNvclBsdWdpbikge1xuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcblx0fVxuXG5cdGRpc3BsYXkoKTogdm9pZCB7XG5cdFx0Y29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkF1dG8gSGlkZSBDdXJzb3IgU2V0dGluZ3NcIiB9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJNb3ZlbWVudCBUaHJlc2hvbGQgKHB4KVwiKVxuXHRcdFx0LnNldERlc2MoXCJNaW5pbXVtIGRpc3RhbmNlIHRvIHNob3cgdGhlIGN1cnNvciBhZ2FpblwiKVxuXHRcdFx0LmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG5cdFx0XHRcdHNsaWRlclxuXHRcdFx0XHRcdC5zZXRMaW1pdHMoMCwgMTAsIDEpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1vdmVtZW50VGhyZXNob2xkKVxuXHRcdFx0XHRcdC5zZXREeW5hbWljVG9vbHRpcCgpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MubW92ZW1lbnRUaHJlc2hvbGQgPSB2YWx1ZTtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVVc2VyU2V0dGluZ3MoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIkhpZGUgRGVsYXkgKG1zKVwiKVxuXHRcdFx0LnNldERlc2MoXCJUaW1lIHRvIGhpZGUgdGhlIGN1cnNvciBhZnRlciBzdG9wcGluZyBtb3ZlbWVudFwiKVxuXHRcdFx0LmFkZFNsaWRlcigoc2xpZGVyKSA9PiB7XG5cdFx0XHRcdHNsaWRlclxuXHRcdFx0XHRcdC5zZXRMaW1pdHMoMjAwLCAxMDAwLCAyNSlcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsYXlUaW1lKVxuXHRcdFx0XHRcdC5zZXREeW5hbWljVG9vbHRpcCgpXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVsYXlUaW1lID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlVXNlclNldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUF1RDtBQU92RCxJQUFNLDBCQUEwQztBQUFBLEVBQy9DLG1CQUFtQjtBQUFBLEVBQ25CLFdBQVc7QUFDWjtBQUVBLElBQU0sb0JBQW9CO0FBRTFCLElBQXFCLHVCQUFyQixjQUFrRCx1QkFBTztBQUFBLEVBQXpEO0FBQUE7QUFHQywwQkFBaUI7QUFxRGpCLDZCQUFvQixNQUFNO0FBQ3pCLGVBQVMsS0FBSyxVQUFVLElBQUksaUJBQWlCO0FBQzdDLFdBQUssaUJBQWlCO0FBQUEsSUFDdkI7QUFFQSxnQ0FBdUIsQ0FBQyxRQUFvQjtBQUMzQyxVQUFJLEtBQUssbUNBQW1DLEdBQUcsR0FBRztBQUNqRCxxQkFBYSxLQUFLLGFBQWE7QUFDL0IsaUJBQVMsS0FBSyxVQUFVLE9BQU8saUJBQWlCO0FBQ2hELGFBQUssaUJBQWlCO0FBRXRCLGFBQUssZ0JBQWdCLFdBQVcsTUFBTTtBQUNyQyxtQkFBUyxLQUFLLFVBQVUsSUFBSSxpQkFBaUI7QUFDN0MsZUFBSyxpQkFBaUI7QUFBQSxR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
