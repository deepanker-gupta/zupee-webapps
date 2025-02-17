/*
Copyright 2019 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { useState, useRef, useEffect } from 'react';

import useAttempt from './useAttempt';
import useFavicon from './useFavicon';
import useDocTitle from './useDocTitle';
import useAttemptNext from './useAttemptNext';
import { useRefAutoFocus } from './useRefAutoFocus';

export {
  useRef,
  useAttempt,
  useAttemptNext,
  useState,
  useEffect,
  useFavicon,
  useDocTitle,
  useRefAutoFocus,
};
