"""
XMULogin - 厦门大学统一身份认证登录SDK
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

提供厦门大学统一身份认证系统的登录功能。

基本用法:
    >>> from xmulogin import xmulogin
    >>> session = xmulogin(type=1, username="your_username", password="your_password")
    >>> if session:
    ...     print("登录成功")
    ... else:
    ...     print("登录失败")

:copyright: (c) 2025
:license: MIT
"""

__version__ = '1.0.0'
__author__ = 'XMU Student'

from .core import xmulogin

__all__ = ['xmulogin']

