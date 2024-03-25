from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class SubmitFrameRequest(_message.Message):
    __slots__ = ("frame", "clientStartTime", "clientId")
    FRAME_FIELD_NUMBER: _ClassVar[int]
    CLIENTSTARTTIME_FIELD_NUMBER: _ClassVar[int]
    CLIENTID_FIELD_NUMBER: _ClassVar[int]
    frame: bytes
    clientStartTime: str
    clientId: str
    def __init__(self, frame: _Optional[bytes] = ..., clientStartTime: _Optional[str] = ..., clientId: _Optional[str] = ...) -> None: ...

class SubmitFrameResponse(_message.Message):
    __slots__ = ("serverReceivedTime",)
    SERVERRECEIVEDTIME_FIELD_NUMBER: _ClassVar[int]
    serverReceivedTime: str
    def __init__(self, serverReceivedTime: _Optional[str] = ...) -> None: ...

class SubscribeRequest(_message.Message):
    __slots__ = ("clientId",)
    CLIENTID_FIELD_NUMBER: _ClassVar[int]
    clientId: str
    def __init__(self, clientId: _Optional[str] = ...) -> None: ...

class SubscribeResponse(_message.Message):
    __slots__ = ("frame", "clientStartTime", "serverReceivedTime", "serverProcessedTime")
    FRAME_FIELD_NUMBER: _ClassVar[int]
    CLIENTSTARTTIME_FIELD_NUMBER: _ClassVar[int]
    SERVERRECEIVEDTIME_FIELD_NUMBER: _ClassVar[int]
    SERVERPROCESSEDTIME_FIELD_NUMBER: _ClassVar[int]
    frame: bytes
    clientStartTime: str
    serverReceivedTime: str
    serverProcessedTime: str
    def __init__(self, frame: _Optional[bytes] = ..., clientStartTime: _Optional[str] = ..., serverReceivedTime: _Optional[str] = ..., serverProcessedTime: _Optional[str] = ...) -> None: ...
