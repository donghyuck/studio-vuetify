import { merge } from "lodash-es";
import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import { IN_BROWSER } from "@/util/helpers"
export type RootState = {
  theme: string,
  mixedTheme: boolean,
  direction: 'rtl' | 'ltr',
};

export const usePrefsStore = defineStore("preferences", () => {
  const state = reactive<RootState>({
    theme: "system",
    mixedTheme: true,
    direction: 'ltr',
  });

  function load () {
    const stored = localStorage.getItem("studio@preferences");
    const data = stored ? JSON.parse(stored) : {};
    if (typeof data.theme === "object") {
      data.mixedTheme = data.theme.mixed;
      data.theme = data.theme.system
        ? "system"
        : data.theme.dark
        ? "dark"
        : "light";
    }
    if (typeof data.rtl === 'boolean') {
      data.direction = data.rtl ? 'rtl' : 'ltr'
      delete data.rtl
    }
    Object.assign(state, merge(state, data));
  }

  function save () {
    if (!IN_BROWSER) return
    localStorage.setItem("studio@preferences", JSON.stringify(state, null, 2));
  }

  load();
  return { ...toRefs(state), load, save };
});
