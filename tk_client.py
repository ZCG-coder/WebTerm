#!/usr/bin/env python3
"""VT100 terminal color to tkinter Text widget"""

import re
import sys
import tkinter as tk
import tkinter.font as font
from find_ansi import ESC_SEQ, finditer_withlineno

MAIN_KEY = "Control" if not sys.platform == "darwin" else "Command"


class TerminalText(tk.Text):
    def __init__(self, master, string=""):
        super().__init__(master)
        self.string = string
        self.i = 0
        self.j = 1
        if string:
            self.load_tags()
            self.parser(string)
        self.ext = ""
        self.bind(f"<{MAIN_KEY}-c>", self.copy)

    def load_tags(self):
        font_name = self["font"]
        bold_font = font.nametofont(font_name).copy()
        bold_font.config(weight="bold")
        italic_font = font.nametofont(font_name).copy()
        italic_font.config(slant="italic")
        self.tag_config("1", font=bold_font)
        self.tag_config("3", font=italic_font)
        self.tag_config("4", underline=1)
        self.tag_config("9", overstrike=1)
        self.pallet8 = [
            "black",
            "red",
            "green",
            "yellow",
            "blue",
            "magenta",
            "cyan",
            "white",
            "magic",
            "default",  # magic: enable 256 color
        ]
        for i in range(8):  # pallet8
            self.tag_config(str(i + 30), foreground=self.pallet8[i])
            self.tag_config(str(i + 40), background=self.pallet8[i])
        pallet16 = [
            "000000",
            "800000",
            "008000",
            "808000",
            "000080",
            "800080",
            "008080",
            "c0c0c0",
            "808080",
            "ff0000",
            "00ff00",
            "ffff00",
            "0000ff",
            "ff00ff",
            "00ffff",
            "ffffff",
        ]
        for i in range(16):  # 0-15/256-colors
            self.tag_config(str(i) + "fg", foreground="#" + pallet16[i])
            self.tag_config(str(i) + "bg", background="#" + pallet16[i])
        xx = ["00", "5f", "87", "af", "d7", "ff"]
        for i in range(0, 216):  # 16-231/256-colors
            prefix = str(i + 16)
            rgb = "#" + xx[i // 36] + xx[(i // 6) % 6] + xx[i % 6]
            self.tag_config(prefix + "fg", foreground=rgb)
            self.tag_config(prefix + "bg", background=rgb)
        for i in range(24):  # 232-255/256-colors
            prefix = str(i + 232)
            rgb = "#" + hex(i * 10 + 8)[2:] * 3
            self.tag_config(prefix + "fg", foreground=rgb)
            self.tag_config(prefix + "bg", background=rgb)
        self.tag_config("escape", elide=True)

    def make_sgr_tag(self, code):
        code = code.split(";")
        for x in code:
            self.tag_add(x, self.pre, self.cur)
        return code

    @staticmethod
    def remove_esc(string):
        replaced = re.sub(ESC_SEQ, "", string)
        return replaced

    def copy(self, _):
        content = self.get("sel.first", "sel.last")
        content = self.remove_esc(content)
        self.clipboard_clear()
        self.clipboard_append(content)
        return "break"

    def parser(self, string):
        self.delete("1.0", "end")
        self.insert("1.0", string)
        res = finditer_withlineno(ESC_SEQ, string)
        res = list(res)
        for index, item in enumerate(res):
            item_length = len(item[2].group(0))
            if index < len(res) - 1:
                next_item = res[index + 1]
                self.cur = f"{next_item[0][0]}.{next_item[0][1]}"
            else:
                self.cur = "end"
            self.pre = f"{item[0][0]}.{item[0][1]}+{item_length}c"
            self.tag_add("escape", f"{self.pre}-{item_length}c", self.pre)
            self.make_sgr_tag(item[2].group(1))


if __name__ == "__main__":
    root = tk.Tk()

    t = TerminalText(root, "\x1b[1;31mHello World\n\x1b[32mHello\x1b[33mHello")
    t.pack(fill="both", expand=True)
    root.bind("<Key-Escape>", lambda _: root.quit())
    tk.mainloop()
