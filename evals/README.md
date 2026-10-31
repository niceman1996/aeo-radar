# evals/

agent 评估用例与运行结果：

- 用例：`cases.jsonl`，每行一条 `{ "input": ..., "expect": ... }`。
- 结果：`runs/YYYY-MM-DD-<name>.md` 记录跑分结论。
- 原则：改动系统提示词或关键流程前，先跑一遍评估留档，再对比。
