# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: video.proto
# Protobuf Python Version: 4.25.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0bvideo.proto\x12\x0fvideoProcessing\"N\n\x12SubmitFrameRequest\x12\r\n\x05\x66rame\x18\x01 \x01(\x0c\x12\x17\n\x0f\x63lientStartTime\x18\x02 \x01(\t\x12\x10\n\x08\x63lientId\x18\x03 \x01(\t\"1\n\x13SubmitFrameResponse\x12\x1a\n\x12serverReceivedTime\x18\x01 \x01(\t\"$\n\x10SubscribeRequest\x12\x10\n\x08\x63lientId\x18\x01 \x01(\t\"t\n\x11SubscribeResponse\x12\r\n\x05\x66rame\x18\x01 \x01(\x0c\x12\x17\n\x0f\x63lientStartTime\x18\x02 \x01(\t\x12\x1a\n\x12serverReceivedTime\x18\x03 \x01(\t\x12\x1b\n\x13serverProcessedTime\x18\x04 \x01(\t2\xc5\x01\n\x0fVideoProcessing\x12Z\n\x0bSubmitFrame\x12#.videoProcessing.SubmitFrameRequest\x1a$.videoProcessing.SubmitFrameResponse\"\x00\x12V\n\tSubscribe\x12!.videoProcessing.SubscribeRequest\x1a\".videoProcessing.SubscribeResponse\"\x00\x30\x01\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'video_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_SUBMITFRAMEREQUEST']._serialized_start=32
  _globals['_SUBMITFRAMEREQUEST']._serialized_end=110
  _globals['_SUBMITFRAMERESPONSE']._serialized_start=112
  _globals['_SUBMITFRAMERESPONSE']._serialized_end=161
  _globals['_SUBSCRIBEREQUEST']._serialized_start=163
  _globals['_SUBSCRIBEREQUEST']._serialized_end=199
  _globals['_SUBSCRIBERESPONSE']._serialized_start=201
  _globals['_SUBSCRIBERESPONSE']._serialized_end=317
  _globals['_VIDEOPROCESSING']._serialized_start=320
  _globals['_VIDEOPROCESSING']._serialized_end=517
# @@protoc_insertion_point(module_scope)
