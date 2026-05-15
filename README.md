# xmulogin

XMULogin 是一个用于厦门大学各种系统的统一登录 Python SDK。它支持登录统一身份认证系统、教务系统以及数字化教学平台 (TronClass)。它自动处理了登录所需的 AES 密码加密和各类重定向跳转。

## 环境和安装 (Installation)

该模块需要在 Python 环境中预先安装以下依赖：
- `requests`
- `pycryptodome` (提供 `Crypto.Cipher.AES`)

通常可以通过项目内的代码进行安装：
```bash
python setup.py install
```

## 功能 (Features)

目前支持以下系统的登录认证：
1. **统一身份认证系统** (`type=1`)
2. **教务系统** (`type=2`)
3. **数字化教学平台 (TronClass)** (`type=3`)

登录成功后，将返回一个维持登录状态的 `requests.Session` 对象。你可以继续使用该 Session 构建后续请求。

## 使用示例 (Usage)

```python
from xmulogin import xmulogin

username = "your_username"  # 学号或工号
password = "your_password"  # 密码

# type 参数说明:
# 1 - 统一身份认证系统
# 2 - 教务系统
# 3 - 数字化教学平台 (TronClass)
session = xmulogin(type=1, username=username, password=password)

if session:
    print("登录成功！")
    # 此时可以使用该 session 继续访问已被授权的网页页面
    response = session.get("https://ids.xmu.edu.cn/authserver/index.do")
    print(response.status_code)
else:
    print("登录失败，请检查账号密码！")
```

## 协议 (License)

基于 [MIT License](LICENSE) 协议开源。

