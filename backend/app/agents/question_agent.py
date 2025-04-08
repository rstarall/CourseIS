from langchain.agents import Tool, AgentExecutor, LLMSingleActionAgent
from langchain.prompts import StringPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema import AgentAction, AgentFinish
from typing import List, Union
import re
import json
from app.core.config import settings

class QuestionClassifier:
    def __init__(self):
        # 配置LLM
        if settings.LLM_PROVIDER == "siliconflow":
            self.llm = ChatOpenAI(
                temperature=0,
                model_name=settings.BASE_MODEL,
                openai_api_key=settings.API_KEY,
                openai_api_base=settings.API_BASE
            )
        else:
            self.llm = ChatOpenAI(
                temperature=0,
                model_name="gpt-3.5-turbo",
                openai_api_key=settings.OPENAI_API_KEY
            )
        
        self.categories = [
            "知识点定义类",
            "知识点应用类",
            "知识点关联类",
            "知识点理解类",
            "知识点拓展类",
            "知识点纠错类"
        ]
        
    async def classify_question(self, question: str) -> dict:
        prompt = f"""
        请将以下问题分类到最合适的类别中。类别包括：{', '.join(self.categories)}
        
        问题：{question}
        
        请以JSON格式返回，包含以下字段：
        - category: 分类名称
        - confidence: 置信度（0-1之间的浮点数）
        - explanation: 分类理由
        
        只返回JSON格式的结果，不要包含其他文字。
        """
        print(f"对问题分类：{question}")
        response = await self.llm.ainvoke(prompt)
        print(f"分类结果：{response.content}")
        try:
            # 使用正则表达式提取JSON部分
            json_match = re.search(r'```json\s*(.*?)\s*```', response.content, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
                result = json.loads(json_str)
            else:
                # 尝试直接解析JSON
                result = json.loads(response.content)
            
            print(f"分类结果：{result}")
            return {
                "category": result["category"],
                "confidence": result["confidence"],
                "explanation": result["explanation"]
            }
        except Exception as e:
            print(f"解析分类结果失败: {e}")
            return {
                "category": "未分类",
                "confidence": 0.0,
                "explanation": "分类失败"
            }
            
    async def batch_classify(self, questions: List[str]) -> List[dict]:
        results = []
        for question in questions:
            result = await self.classify_question(question)
            results.append(result)
        return results 