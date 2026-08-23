from agents.validation_agent import ValidationAgent


def test_validation_agent_returns_result():
    agent = ValidationAgent()
    result = agent.run({})
    assert isinstance(result, dict)
    assert "is_valid" in result
    assert "errors" in result


def test_validation_agent_rejects_empty_product():
    agent = ValidationAgent()
    result = agent.run({})
    assert result["is_valid"] is False
