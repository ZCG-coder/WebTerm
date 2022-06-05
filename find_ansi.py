import re
from typing import *

ESCAPE = "\x1b[1;2mHello world\x1b[0m\n\x1b[1;2mHello world"
ESC_SEQ = re.compile("\x1b\[((?:\d|;)*)([a-zA-Z])", re.MULTILINE)


def finditer_withlineno(
    pattern, string, flags: Union[re.RegexFlag, int] = 0
) -> Iterable[Tuple[int]]:
    """
    A version of re.finditer that returns '(line_number, column_number, match)' triples.
    Imported from PyPlus: https://github.com/ZCG-Coder/PyPlus
    """

    matches = list(re.finditer(pattern, string, flags))
    if not matches:
        return []

    end = matches[-1].start()
    # -1 so a failed 'rfind' maps to the first line.
    newline_table = {-1: 0}
    for i, m in enumerate(re.finditer(r"\n", string), 1):
        # don't find newlines past the last match
        offset = m.start()
        if offset > end:
            break
        newline_table[offset] = i

    # Failing to find the newline is OK,–1 maps to 0.
    for m in matches:
        newline_offset = string.rfind("\n", 0, m.start())
        line_number = newline_table[newline_offset]
        yield (
            (line_number + 1, m.start() - newline_offset - 1),
            (line_number + 1, m.end() - newline_offset - 1),
            m,
        )
