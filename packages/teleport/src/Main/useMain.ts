/*
Copyright 2019-2022 Gravitational, Inc.

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

import { useEffect } from 'react';
import useAttempt from 'shared/hooks/useAttemptNext';

import useTeleport from 'teleport/useTeleport';
import { Feature } from 'teleport/types';

export default function useMain(features: Feature[]) {
  const ctx = useTeleport();
  const { attempt, setAttempt, run } = useAttempt('processing');

  useEffect(() => {
    // Two routes that uses this hook that can trigger this effect:
    //  - cfg.root
    //  - cfg.discover
    // These two routes both require top user nav dropdown items
    // to be in sync and requires fetching of user context state before
    // rendering.
    //
    // When one route calls init() e.g: if user redirects to discover on login,
    // it isn't required to refetch context and reinit features with the other
    // route and vice versa.
    if (ctx.storeUser.state) {
      setAttempt({ status: 'success' });
      return;
    }

    run(() => ctx.init(features));
  }, []);

  return {
    ctx,
    status: attempt.status,
    statusText: attempt.statusText,
  };
}

export type State = ReturnType<typeof useMain>;
