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

import { formatDistanceStrict } from 'date-fns';

import { Event, RawEvent, Formatters, eventCodes } from './types';

export const formatters: Formatters = {
  [eventCodes.ACCESS_REQUEST_CREATED]: {
    type: 'access_request.create',
    desc: 'Access Request Created',
    format: ({ id, state }) =>
      `Access request [${id}] has been created and is ${state}`,
  },
  [eventCodes.ACCESS_REQUEST_UPDATED]: {
    type: 'access_request.update',
    desc: 'Access Request Updated',
    format: ({ id, state }) =>
      `Access request [${id}] has been updated to ${state}`,
  },
  [eventCodes.ACCESS_REQUEST_REVIEWED]: {
    type: 'access_request.review',
    desc: 'Access Request Reviewed',
    format: ({ id, reviewer }) =>
      `User [${reviewer}] reviewed access request [${id}]`,
  },
  [eventCodes.ACCESS_REQUEST_DELETED]: {
    type: 'access_request.delete',
    desc: 'Access Request Deleted',
    format: ({ id }) => `Access request [${id}] has been deleted`,
  },
  [eventCodes.ACCESS_REQUEST_RESOURCE_SEARCH]: {
    type: 'access_request.search',
    desc: 'Resource Access Request Search',
    format: ({ user, resource_type, search_as_roles }) =>
      `User [${user}] searched for resource type [${resource_type}] with role(s) [${search_as_roles}]`,
  },
  [eventCodes.SESSION_COMMAND]: {
    type: 'session.command',
    desc: 'Session Command',
    format: ({ program, sid }) =>
      `Program [${program}] has been executed within a session [${sid}]`,
  },
  [eventCodes.SESSION_DISK]: {
    type: 'session.disk',
    desc: 'Session File Access',
    format: ({ path, sid, program }) =>
      `Program [${program}] accessed a file [${path}] within a session [${sid}]`,
  },
  [eventCodes.SESSION_NETWORK]: {
    type: 'session.network',
    desc: 'Session Network Connection',
    format: ({ action, sid, program, src_addr, dst_addr, dst_port }) => {
      const a = action === 1 ? '[DENY]' : '[ALLOW]';
      const desc =
        action === 1 ? 'was prevented from opening' : 'successfully opened';
      return `${a} Program [${program}] ${desc} a connection [${src_addr} <-> ${dst_addr}:${dst_port}] within a session [${sid}]`;
    },
  },
  [eventCodes.SESSION_PROCESS_EXIT]: {
    type: 'session.process_exit',
    desc: 'Session Process Exit',
    format: ({ program, exit_status, sid }) =>
      `Program [${program}] has exited with status ${exit_status}, within a session [${sid}]`,
  },
  [eventCodes.SESSION_DATA]: {
    type: 'session.data',
    desc: 'Session Data',
    format: ({ sid }) =>
      `Usage report has been updated for session [${sid || ''}]`,
  },

  [eventCodes.USER_PASSWORD_CHANGED]: {
    type: 'user.password_change',
    desc: 'User Password Updated',
    format: ({ user }) => `User [${user}] has changed a password`,
  },

  [eventCodes.USER_UPDATED]: {
    type: 'user.update',
    desc: 'User Updated',
    format: ({ name }) => `User [${name}] has been updated`,
  },
  [eventCodes.RESET_PASSWORD_TOKEN_CREATED]: {
    type: 'reset_password_token.create',
    desc: 'Reset Password Token Created',
    format: ({ name, user }) =>
      `User [${user}] created a password reset token for user [${name}]`,
  },
  [eventCodes.AUTH_ATTEMPT_FAILURE]: {
    type: 'auth',
    desc: 'Auth Attempt Failed',
    format: ({ user, error }) => `User [${user}] failed auth attempt: ${error}`,
  },

  [eventCodes.CLIENT_DISCONNECT]: {
    type: 'client.disconnect',
    desc: 'Client Disconnected',
    format: ({ user, reason }) =>
      `User [${user}] has been disconnected: ${reason}`,
  },
  [eventCodes.EXEC]: {
    type: 'exec',
    desc: 'Command Execution',
    format: event => {
      const { proto, kubernetes_cluster, user = '' } = event;
      if (proto === 'kube') {
        if (!kubernetes_cluster) {
          return `User [${user}] executed a kubernetes command`;
        }
        return `User [${user}] executed a command on kubernetes cluster [${kubernetes_cluster}]`;
      }

      return `User [${user}] executed a command on node ${event['addr.local']}`;
    },
  },
  [eventCodes.EXEC_FAILURE]: {
    type: 'exec',
    desc: 'Command Execution Failed',
    format: ({ user, exitError, ...rest }) =>
      `User [${user}] command execution on node ${rest['addr.local']} failed [${exitError}]`,
  },
  [eventCodes.GITHUB_CONNECTOR_CREATED]: {
    type: 'github.created',
    desc: 'GITHUB Auth Connector Created',
    format: ({ user, name }) =>
      `User [${user}] created Github connector [${name}] has been created`,
  },
  [eventCodes.GITHUB_CONNECTOR_DELETED]: {
    type: 'github.deleted',
    desc: 'GITHUB Auth Connector Deleted',
    format: ({ user, name }) =>
      `User [${user}] deleted Github connector [${name}]`,
  },
  [eventCodes.OIDC_CONNECTOR_CREATED]: {
    type: 'oidc.created',
    desc: 'OIDC Auth Connector Created',
    format: ({ user, name }) =>
      `User [${user}] created OIDC connector [${name}]`,
  },
  [eventCodes.OIDC_CONNECTOR_DELETED]: {
    type: 'oidc.deleted',
    desc: 'OIDC Auth Connector Deleted',
    format: ({ user, name }) =>
      `User [${user}] deleted OIDC connector [${name}]`,
  },
  [eventCodes.PORTFORWARD]: {
    type: 'port',
    desc: 'Port Forwarding Started',
    format: ({ user }) => `User [${user}] started port forwarding`,
  },
  [eventCodes.PORTFORWARD_FAILURE]: {
    type: 'port',
    desc: 'Port Forwarding Failed',
    format: ({ user, error }) =>
      `User [${user}] port forwarding request failed: ${error}`,
  },
  [eventCodes.SAML_CONNECTOR_CREATED]: {
    type: 'saml.created',
    desc: 'SAML Connector Created',
    format: ({ user, name }) =>
      `User [${user}] created SAML connector [${name}]`,
  },
  [eventCodes.SAML_CONNECTOR_DELETED]: {
    type: 'saml.deleted',
    desc: 'SAML Connector Deleted',
    format: ({ user, name }) =>
      `User [${user}] deleted SAML connector [${name}]`,
  },
  [eventCodes.SCP_DOWNLOAD]: {
    type: 'scp',
    desc: 'SCP Download',
    format: ({ user, path, ...rest }) =>
      `User [${user}] downloaded a file [${path}] from node [${rest['addr.local']}]`,
  },
  [eventCodes.SCP_DOWNLOAD_FAILURE]: {
    type: 'scp',
    desc: 'SCP Download Failed',
    format: ({ exitError, ...rest }) =>
      `File download from node [${rest['addr.local']}] failed [${exitError}]`,
  },
  [eventCodes.SCP_UPLOAD]: {
    type: 'scp',
    desc: 'SCP Upload',
    format: ({ user, path, ...rest }) =>
      `User [${user}] uploaded a file [${path}] to node [${rest['addr.local']}]`,
  },
  [eventCodes.SCP_UPLOAD_FAILURE]: {
    type: 'scp',
    desc: 'SCP Upload Failed',
    format: ({ exitError, ...rest }) =>
      `File upload to node [${rest['addr.local']}] failed [${exitError}]`,
  },
  [eventCodes.SFTP_OPEN]: {
    type: 'sftp',
    desc: 'SFTP Open',
    format: ({ user, path, ...rest }) =>
      `User [${user}] opened file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_OPEN_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Open Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to open file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_CLOSE]: {
    type: 'sftp',
    desc: 'SFTP Close',
    format: ({ user, path, ...rest }) =>
      `User [${user}] closed file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_CLOSE_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Close Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to close file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_READ]: {
    type: 'sftp',
    desc: 'SFTP Read',
    format: ({ user, path, ...rest }) =>
      `User [${user}] read from file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_READ_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Read Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to read from file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_WRITE]: {
    type: 'sftp',
    desc: 'SFTP Write',
    format: ({ user, path, ...rest }) =>
      `User [${user}] wrote to file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_WRITE_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Write Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to write to file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_LSTAT]: {
    type: 'sftp',
    desc: 'SFTP Lstat',
    format: ({ user, path, ...rest }) =>
      `User [${user}] queried attributes of file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_LSTAT_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Lstat Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to query attributes of file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_FSTAT]: {
    type: 'sftp',
    desc: 'SFTP Fstat',
    format: ({ user, path, ...rest }) =>
      `User [${user}] queried attributes of file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_FSTAT_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Fstat Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to query attributes of file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_SETSTAT]: {
    type: 'sftp',
    desc: 'SFTP Setstat',
    format: ({ user, path, ...rest }) =>
      `User [${user}] changed attributes of file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_SETSTAT_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Setstat Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to change attributes of file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_FSETSTAT]: {
    type: 'sftp',
    desc: 'SFTP Fsetstat',
    format: ({ user, path, ...rest }) =>
      `User [${user}] changed attributes of file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_FSETSTAT_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Fsetstat Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to change attributes of file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_OPENDIR]: {
    type: 'sftp',
    desc: 'SFTP Opendir',
    format: ({ user, path, ...rest }) =>
      `User [${user}] opened directory [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_OPENDIR_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Opendir Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to open directory [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_READDIR]: {
    type: 'sftp',
    desc: 'SFTP Readdir',
    format: ({ user, path, ...rest }) =>
      `User [${user}] read directory [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_READDIR_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Readdir Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to read directory [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_REMOVE]: {
    type: 'sftp',
    desc: 'SFTP Remove',
    format: ({ user, path, ...rest }) =>
      `User [${user}] removed file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_REMOVE_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Remove Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to remove file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_MKDIR]: {
    type: 'sftp',
    desc: 'SFTP Mkdir',
    format: ({ user, path, ...rest }) =>
      `User [${user}] created directory [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_MKDIR_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Mkdir Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to create directory [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_RMDIR]: {
    type: 'sftp',
    desc: 'SFTP Rmdir',
    format: ({ user, path, ...rest }) =>
      `User [${user}] removed directory [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_RMDIR_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Rmdir Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to remove directory [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_REALPATH]: {
    type: 'sftp',
    desc: 'SFTP Realpath',
    format: ({ user, path, ...rest }) =>
      `User [${user}] queried absolute path of file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_REALPATH_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Realpath Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to query absolute path of file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_STAT]: {
    type: 'sftp',
    desc: 'SFTP Stat',
    format: ({ user, path, ...rest }) =>
      `User [${user}] queried attributes of file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_STAT_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Stat Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to query attributes of file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_RENAME]: {
    type: 'sftp',
    desc: 'SFTP Rename',
    format: ({ user, path, ...rest }) =>
      `User [${user}] renamed file [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_RENAME_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Rename Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to rename file [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_READLINK]: {
    type: 'sftp',
    desc: 'SFTP Readlink',
    format: ({ user, path, ...rest }) =>
      `User [${user}] read symbolic link [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_READLINK_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Readlink Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to read symbolic link [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SFTP_SYMLINK]: {
    type: 'sftp',
    desc: 'SFTP Symlink',
    format: ({ user, path, ...rest }) =>
      `User [${user}] created symbolic link [${path}] on node [${rest['addr.local']}]`,
  },
  [eventCodes.SFTP_SYMLINK_FAILURE]: {
    type: 'sftp',
    desc: 'SFTP Symlink Failed',
    format: ({ user, path, error, ...rest }) =>
      `User [${user}] failed to create symbolic link [${path}] on node [${rest['addr.local']}]: [${error}]`,
  },
  [eventCodes.SESSION_JOIN]: {
    type: 'session.join',
    desc: 'User Joined',
    format: ({ user, sid }) => `User [${user}] has joined the session [${sid}]`,
  },
  [eventCodes.SESSION_END]: {
    type: 'session.end',
    desc: 'Session Ended',
    format: event => {
      const user = event.user || '';
      const node =
        event.server_hostname || event.server_addr || event.server_id;

      if (event.proto === 'kube') {
        if (!event.kubernetes_cluster) {
          return `User [${user}] has ended a kubernetes session [${event.sid}]`;
        }
        return `User [${user}] has ended a session [${event.sid}] on kubernetes cluster [${event.kubernetes_cluster}]`;
      }

      if (!event.interactive) {
        return `User [${user}] has ended a non-interactive session [${event.sid}] on node [${node}] `;
      }

      if (event.session_start && event.session_stop) {
        const start = new Date(event.session_start);
        const end = new Date(event.session_stop);
        const durationText = formatDistanceStrict(start, end);
        return `User [${user}] has ended an interactive session lasting ${durationText} [${event.sid}] on node [${node}]`;
      }

      return `User [${user}] has ended interactive session [${event.sid}] on node [${node}] `;
    },
  },
  [eventCodes.SESSION_REJECT]: {
    type: 'session.rejected',
    desc: 'Session Rejected',
    format: ({ user, login, server_id, reason }) =>
      `User [${user}] was denied access to [${login}@${server_id}] because [${reason}]`,
  },
  [eventCodes.SESSION_LEAVE]: {
    type: 'session.leave',
    desc: 'User Disconnected',
    format: ({ user, sid }) => `User [${user}] has left the session [${sid}]`,
  },
  [eventCodes.SESSION_START]: {
    type: 'session.start',
    desc: 'Session Started',
    format: ({ user, sid }) => `User [${user}] has started a session [${sid}]`,
  },
  [eventCodes.SESSION_UPLOAD]: {
    type: 'session.upload',
    desc: 'Session Uploaded',
    format: () => `Recorded session has been uploaded`,
  },
  [eventCodes.APP_SESSION_START]: {
    type: 'app.session.start',
    desc: 'App Session Started',
    format: event => {
      const { user, app_name, aws_role_arn } = event;
      if (aws_role_arn) {
        return `User [${user}] has connected to AWS console [${app_name}]`;
      }
      return `User [${user}] has connected to application [${app_name}]`;
    },
  },
  [eventCodes.APP_SESSION_END]: {
    type: 'app.session.end',
    desc: 'App Session Ended',
    format: event => {
      const { user, app_name } = event;
      return `User [${user}] has disconnected from application [${app_name}]`;
    },
  },
  [eventCodes.APP_SESSION_CHUNK]: {
    type: 'app.session.chunk',
    desc: 'App Session Data',
    format: event => {
      const { user, app_name } = event;
      return `New session data chunk created for application [${app_name}] accessed by user [${user}]`;
    },
  },
  [eventCodes.SUBSYSTEM]: {
    type: 'subsystem',
    desc: 'Subsystem Requested',
    format: ({ user, name }) => `User [${user}] requested subsystem [${name}]`,
  },
  [eventCodes.SUBSYSTEM_FAILURE]: {
    type: 'subsystem',
    desc: 'Subsystem Request Failed',
    format: ({ user, name, exitError }) =>
      `User [${user}] subsystem [${name}] request failed [${exitError}]`,
  },
  [eventCodes.TERMINAL_RESIZE]: {
    type: 'resize',
    desc: 'Terminal Resize',
    format: ({ user, sid }) =>
      `User [${user}] resized the session [${sid}] terminal`,
  },
  [eventCodes.USER_CREATED]: {
    type: 'user.create',
    desc: 'User Created',
    format: ({ name }) => `User [${name}] has been created`,
  },
  [eventCodes.USER_DELETED]: {
    type: 'user.delete',
    desc: 'User Deleted',
    format: ({ name }) => `User [${name}] has been deleted`,
  },
  [eventCodes.USER_LOCAL_LOGIN]: {
    type: 'user.login',
    desc: 'Local Login',
    format: ({ user }) => `Local user [${user}] successfully logged in`,
  },
  [eventCodes.USER_LOCAL_LOGINFAILURE]: {
    type: 'user.login',
    desc: 'Local Login Failed',
    format: ({ user, error }) => `Local user [${user}] login failed [${error}]`,
  },
  [eventCodes.USER_SSO_LOGIN]: {
    type: 'user.login',
    desc: 'SSO Login',
    format: ({ user }) => `SSO user [${user}] successfully logged in`,
  },
  [eventCodes.USER_SSO_LOGINFAILURE]: {
    type: 'user.login',
    desc: 'SSO Login Failed',
    format: ({ error }) => `SSO user login failed [${error}]`,
  },
  [eventCodes.USER_SSO_TEST_FLOW_LOGIN]: {
    type: 'user.login',
    desc: 'SSO Test Flow Login',
    format: ({ user }) =>
      `SSO Test Flow: user [${user}] successfully logged in`,
  },
  [eventCodes.USER_SSO_TEST_FLOW_LOGINFAILURE]: {
    type: 'user.login',
    desc: 'SSO Test Flow Login Failed',
    format: ({ error }) => `SSO Test flow: user login failed [${error}]`,
  },
  [eventCodes.ROLE_CREATED]: {
    type: 'role.created',
    desc: 'User Role Created',
    format: ({ user, name }) => `User [${user}] created a role [${name}]`,
  },
  [eventCodes.ROLE_DELETED]: {
    type: 'role.deleted',
    desc: 'User Role Deleted',
    format: ({ user, name }) => `User [${user}] deleted a role [${name}]`,
  },
  [eventCodes.TRUSTED_CLUSTER_TOKEN_CREATED]: {
    type: 'trusted_cluster_token.create',
    desc: 'Trusted Cluster Token Created',
    format: ({ user }) => `User [${user}] has created a trusted cluster token`,
  },
  [eventCodes.TRUSTED_CLUSTER_CREATED]: {
    type: 'trusted_cluster.create',
    desc: 'Trusted Cluster Created',
    format: ({ user, name }) =>
      `User [${user}] has created a trusted relationship with cluster [${name}]`,
  },
  [eventCodes.TRUSTED_CLUSTER_DELETED]: {
    type: 'trusted_cluster.delete',
    desc: 'Trusted Cluster Deleted',
    format: ({ user, name }) =>
      `User [${user}] has deleted a trusted relationship with cluster [${name}]`,
  },
  [eventCodes.KUBE_REQUEST]: {
    type: 'kube.request',
    desc: 'Kubernetes Request',
    format: ({ user, kubernetes_cluster }) =>
      `User [${user}] made a request to kubernetes cluster [${kubernetes_cluster}]`,
  },
  [eventCodes.DATABASE_SESSION_STARTED]: {
    type: 'db.session.start',
    desc: 'Database Session Started',
    format: ({ user, db_service, db_name, db_user }) =>
      `User [${user}] has connected to database [${db_name}] as [${db_user}] on [${db_service}]`,
  },
  [eventCodes.DATABASE_SESSION_STARTED_FAILURE]: {
    type: 'db.session.start',
    desc: 'Database Session Denied',
    format: ({ user, db_service, db_name, db_user }) =>
      `User [${user}] was denied access to database [${db_name}] as [${db_user}] on [${db_service}]`,
  },
  [eventCodes.DATABASE_SESSION_ENDED]: {
    type: 'db.session.end',
    desc: 'Database Session Ended',
    format: ({ user, db_service, db_name }) =>
      `User [${user}] has disconnected from database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.DATABASE_SESSION_QUERY]: {
    type: 'db.session.query',
    desc: 'Database Query',
    format: ({ user, db_service, db_name, db_query }) =>
      `User [${user}] has executed query [${truncateStr(
        db_query,
        80
      )}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.DATABASE_SESSION_QUERY_FAILURE]: {
    type: 'db.session.query.failed',
    desc: 'Database Query Failed',
    format: ({ user, db_service, db_name, db_query }) =>
      `User [${user}] query [${truncateStr(
        db_query,
        80
      )}] in database [${db_name}] on [${db_service}] failed`,
  },
  [eventCodes.DATABASE_SESSION_MALFORMED_PACKET]: {
    type: 'db.session.malformed_packet"',
    desc: 'Database Malformed Packet',
    format: ({ user, db_service, db_name }) =>
      `Recived malformed packet from [${user}] in [${db_name}] on database [${db_service}]`,
  },
  [eventCodes.DATABASE_CREATED]: {
    type: 'db.create',
    desc: 'Database Created',
    format: ({ user, name }) => `User [${user}] created database [${name}]`,
  },
  [eventCodes.DATABASE_UPDATED]: {
    type: 'db.update',
    desc: 'Database Updated',
    format: ({ user, name }) => `User [${user}] updated database [${name}]`,
  },
  [eventCodes.DATABASE_DELETED]: {
    type: 'db.delete',
    desc: 'Database Deleted',
    format: ({ user, name }) => `User [${user}] deleted database [${name}]`,
  },
  [eventCodes.POSTGRES_PARSE]: {
    type: 'db.session.postgres.statements.parse',
    desc: 'PostgreSQL Statement Parse',
    format: ({ user, db_service, statement_name, query }) =>
      `User [${user}] has prepared [${truncateStr(
        query,
        80
      )}] as statement [${statement_name}] on [${db_service}]`,
  },
  [eventCodes.POSTGRES_BIND]: {
    type: 'db.session.postgres.statements.bind',
    desc: 'PostgreSQL Statement Bind',
    format: ({ user, db_service, statement_name, portal_name }) =>
      `User [${user}] has readied statement [${statement_name}] for execution as portal [${portal_name}] on [${db_service}]`,
  },
  [eventCodes.POSTGRES_EXECUTE]: {
    type: 'db.session.postgres.statements.execute',
    desc: 'PostgreSQL Statement Execute',
    format: ({ user, db_service, portal_name }) =>
      `User [${user}] has executed portal [${portal_name}] on [${db_service}]`,
  },
  [eventCodes.POSTGRES_CLOSE]: {
    type: 'db.session.postgres.statements.close',
    desc: 'PostgreSQL Statement Close',
    format: e => {
      if (e.portal_name) {
        return `User [${e.user}] has closed portal [${e.portal_name}] on [${e.db_service}]`;
      }
      return `User [${e.user}] has closed statement [${e.statement_name}] on [${e.db_service}]`;
    },
  },
  [eventCodes.POSTGRES_FUNCTION_CALL]: {
    type: 'db.session.postgres.function',
    desc: 'PostgreSQL Function Call',
    format: ({ user, db_service, function_oid }) =>
      `User [${user}] has executed function with OID [${function_oid}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_PREPARE]: {
    type: 'db.session.mysql.statements.prepare',
    desc: 'MySQL Statement Prepare',
    format: ({ user, db_service, db_name, query }) =>
      `User [${user}] has prepared [${truncateStr(
        query,
        80
      )}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_EXECUTE]: {
    type: 'db.session.mysql.statements.execute',
    desc: 'MySQL Statement Execute',
    format: ({ user, db_service, db_name, statement_id }) =>
      `User [${user}] has executed statement [${statement_id}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_SEND_LONG_DATA]: {
    type: 'db.session.mysql.statements.send_long_data',
    desc: 'MySQL Statement Send Long Data',
    format: ({
      user,
      db_service,
      db_name,
      statement_id,
      parameter_id,
      data_size,
    }) =>
      `User [${user}] has sent ${data_size} bytes of data to parameter [${parameter_id}] of statement [${statement_id}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_CLOSE]: {
    type: 'db.session.mysql.statements.close',
    desc: 'MySQL Statement Close',
    format: ({ user, db_service, db_name, statement_id }) =>
      `User [${user}] has closed statement [${statement_id}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_RESET]: {
    type: 'db.session.mysql.statements.reset',
    desc: 'MySQL Statement Reset',
    format: ({ user, db_service, db_name, statement_id }) =>
      `User [${user}] has reset statement [${statement_id}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_FETCH]: {
    type: 'db.session.mysql.statements.fetch',
    desc: 'MySQL Statement Fetch',
    format: ({ user, db_service, db_name, rows_count, statement_id }) =>
      `User [${user}] has fetched ${rows_count} rows of statement [${statement_id}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_STATEMENT_BULK_EXECUTE]: {
    type: 'db.session.mysql.statements.bulk_execute',
    desc: 'MySQL Statement Bulk Execute',
    format: ({ user, db_service, db_name, statement_id }) =>
      `User [${user}] has executed statement [${statement_id}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_INIT_DB]: {
    type: 'db.session.mysql.init_db',
    desc: 'MySQL Change Database',
    format: ({ user, db_service, schema_name }) =>
      `User [${user}] has changed default database to [${schema_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_CREATE_DB]: {
    type: 'db.session.mysql.create_db',
    desc: 'MySQL Create Database',
    format: ({ user, db_service, schema_name }) =>
      `User [${user}] has created database [${schema_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_DROP_DB]: {
    type: 'db.session.mysql.drop_db',
    desc: 'MySQL Drop Database',
    format: ({ user, db_service, schema_name }) =>
      `User [${user}] has dropped database [${schema_name}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_SHUT_DOWN]: {
    type: 'db.session.mysql.shut_down',
    desc: 'MySQL Shut Down',
    format: ({ user, db_service }) =>
      `User [${user}] has attempted to shut down [${db_service}]`,
  },
  [eventCodes.MYSQL_PROCESS_KILL]: {
    type: 'db.session.mysql.process_kill',
    desc: 'MySQL Kill Process',
    format: ({ user, db_service, process_id }) =>
      `User [${user}] has attempted to kill process [${process_id}] on [${db_service}]`,
  },
  [eventCodes.MYSQL_DEBUG]: {
    type: 'db.session.mysql.debug',
    desc: 'MySQL Debug',
    format: ({ user, db_service }) =>
      `User [${user}] has asked [${db_service}] to dump debug information`,
  },
  [eventCodes.MYSQL_REFRESH]: {
    type: 'db.session.mysql.refresh',
    desc: 'MySQL Refresh',
    format: ({ user, db_service, subcommand }) =>
      `User [${user}] has sent command [${subcommand}] to [${db_service}]`,
  },
  [eventCodes.SQLSERVER_RPC_REQUEST]: {
    type: 'db.session.sqlserver.rpc_request""',
    desc: 'SQLServer RPC Request',
    format: ({ user, db_service, db_name, proc_name }) =>
      `User [${user}] has send RPC Request [${proc_name}] in database [${db_name}] on [${db_service}]`,
  },
  [eventCodes.MFA_DEVICE_ADD]: {
    type: 'mfa.add',
    desc: 'MFA Device Added',
    format: ({ user, mfa_device_name, mfa_device_type }) =>
      `User [${user}] added ${mfa_device_type} device [${mfa_device_name}]`,
  },
  [eventCodes.MFA_DEVICE_DELETE]: {
    type: 'mfa.delete',
    desc: 'MFA Device Deleted',
    format: ({ user, mfa_device_name, mfa_device_type }) =>
      `User [${user}] deleted ${mfa_device_type} device [${mfa_device_name}]`,
  },
  [eventCodes.BILLING_CARD_CREATE]: {
    type: 'billing.create_card',
    desc: 'Credit Card Added',
    format: ({ user }) => `User [${user}] has added a credit card`,
  },
  [eventCodes.BILLING_CARD_DELETE]: {
    type: 'billing.delete_card',
    desc: 'Credit Card Deleted',
    format: ({ user }) => `User [${user}] has deleted a credit card`,
  },
  [eventCodes.BILLING_CARD_UPDATE]: {
    type: 'billing.update_card',
    desc: 'Credit Card Updated',
    format: ({ user }) => `User [${user}] has updated a credit card`,
  },
  [eventCodes.BILLING_INFORMATION_UPDATE]: {
    type: 'billing.update_info',
    desc: 'Billing Information Updated',
    format: ({ user }) => `User [${user}] has updated the billing information`,
  },
  [eventCodes.LOCK_CREATED]: {
    type: 'lock.created',
    desc: 'Lock Created',
    format: ({ user, name }) => `Lock [${name}] was created by user [${user}]`,
  },
  [eventCodes.LOCK_DELETED]: {
    type: 'lock.deleted',
    desc: 'Lock Deleted',
    format: ({ user, name }) => `Lock [${name}] was deleted by user [${user}]`,
  },
  [eventCodes.PRIVILEGE_TOKEN_CREATED]: {
    type: 'privilege_token.create',
    desc: 'Privilege Token Created',
    format: ({ name }) => `Privilege token was created for user [${name}]`,
  },
  [eventCodes.RECOVERY_TOKEN_CREATED]: {
    type: 'recovery_token.create',
    desc: 'Recovery Token Created',
    format: ({ name }) => `Recovery token was created for user [${name}]`,
  },
  [eventCodes.RECOVERY_CODE_GENERATED]: {
    type: 'recovery_code.generated',
    desc: 'Recovery Codes Generated',
    format: ({ user }) =>
      `New recovery codes were generated for user [${user}]`,
  },
  [eventCodes.RECOVERY_CODE_USED]: {
    type: 'recovery_code.used',
    desc: 'Recovery Code Used',
    format: ({ user }) => `User [${user}] successfully used a recovery code`,
  },
  [eventCodes.RECOVERY_CODE_USED_FAILURE]: {
    type: 'recovery_code.used',
    desc: 'Recovery Code Use Failed',
    format: ({ user }) =>
      `User [${user}] failed an attempt to use a recovery code`,
  },
  [eventCodes.DESKTOP_SESSION_STARTED]: {
    type: 'windows.desktop.session.start',
    desc: 'Windows Desktop Session Started',
    format: ({ user, windows_domain, desktop_addr, windows_user }) =>
      `User [${user}] has connected to Windows desktop [${windows_user}@${desktop_addr}] on [${windows_domain}]`,
  },
  [eventCodes.DESKTOP_SESSION_STARTED_FAILED]: {
    type: 'windows.desktop.session.start',
    desc: 'Windows Desktop Session Denied',
    format: ({ user, windows_domain, desktop_addr, windows_user }) =>
      `User [${user}] was denied access to Windows desktop [${windows_user}@${desktop_addr}] on [${windows_domain}]`,
  },
  [eventCodes.DESKTOP_SESSION_ENDED]: {
    type: 'windows.desktop.session.end',
    desc: 'Windows Desktop Session Ended',
    format: ({ user, windows_domain, desktop_addr, windows_user }) =>
      `Session for Windows desktop [${windows_user}@${desktop_addr}] on [${windows_domain}] has ended for user [${user}]`,
  },
  [eventCodes.DESKTOP_CLIPBOARD_RECEIVE]: {
    type: 'desktop.clipboard.receive',
    desc: 'Clipboard Data Received',
    format: ({ user, desktop_addr, length }) =>
      `User [${user}] received ${length} bytes of clipboard data from desktop [${desktop_addr}]`,
  },
  [eventCodes.DESKTOP_CLIPBOARD_SEND]: {
    type: 'desktop.clipboard.send',
    desc: 'Clipboard Data Sent',
    format: ({ user, desktop_addr, length }) =>
      `User [${user}] sent ${length} bytes of clipboard data to desktop [${desktop_addr}]`,
  },
  [eventCodes.X11_FORWARD]: {
    type: 'x11-forward',
    desc: 'X11 Forwarding Requested',
    format: ({ user }) =>
      `User [${user}] has requested x11 forwarding for a session`,
  },
  [eventCodes.X11_FORWARD_FAILURE]: {
    type: 'x11-forward',
    desc: 'X11 Forwarding Request Failed',
    format: ({ user }) =>
      `User [${user}] was denied x11 forwarding for a session`,
  },
  [eventCodes.SESSION_CONNECT]: {
    type: 'session.connect',
    desc: 'Session Connected',
    format: ({ server_addr }) => `Session connected to [${server_addr}]`,
  },
  [eventCodes.CERTIFICATE_CREATED]: {
    type: 'cert.create',
    desc: 'Certificate Issued',
    format: ({ cert_type, identity: { user } }) => {
      if (cert_type === 'user') {
        return `User certificate issued for [${user}]`;
      }
      return `Certificate of type [${cert_type}] issued for [${user}]`;
    },
  },
  [eventCodes.UPGRADE_WINDOW_UPDATED]: {
    type: 'upgradewindow.update',
    desc: 'Upgrade Window Start Updated',
    format: ({ user, upgrade_window_start }) => {
      return `Upgrade Window Start updated to [${upgrade_window_start}] by user [${user}]`;
    },
  },
  [eventCodes.SESSION_RECORDING_ACCESS]: {
    type: 'session.recording.access',
    desc: 'Session Recording Accessed',
    format: ({ sid, user }) => {
      return `User [${user}] accessed a session recording [${sid}]`;
    },
  },
  [eventCodes.UNKNOWN]: {
    type: 'unknown',
    desc: 'Unknown Event',
    format: ({ unknown_type, unknown_code }) =>
      `Unknown '${unknown_type}' event (${unknown_code})`,
  },
};

const unknownFormatter = {
  desc: 'Unknown',
  format: () => 'Unknown',
};

export default function makeEvent(json: any): Event {
  // lookup event formatter by code
  const formatter = formatters[json.code] || unknownFormatter;
  const event = {
    codeDesc: formatter.desc,
    message: formatter.format(json as any),
    id: getId(json),
    code: json.code,
    user: json.user,
    time: json.time,
    raw: json,
  };

  return event;
}

// older events might not have an uid field.
// in this case compose it from other fields.
function getId(json: RawEvent<any>) {
  const { uid, event, time } = json;
  if (uid) {
    return uid;
  }

  return `${event}:${time}`;
}

function truncateStr(str: string, len: number): string {
  if (str.length <= len) {
    return str;
  }
  return str.substring(0, len - 3) + '...';
}
