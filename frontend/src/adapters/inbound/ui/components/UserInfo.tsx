import type { AuthenticatedUser } from '../../../../application/task/ports/outbound/AuthenticationRepository';

interface Props {
  user: AuthenticatedUser;
}

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return '?';
};

const getDisplayName = (name?: string, email?: string): string => {
  return name || email || 'User';
};

export const UserInfo = ({ user }: Props) => {
  const displayName = getDisplayName(user.name, user.email);
  const initials = getInitials(user.name, user.email);

  return (
    <div
      className="d-flex align-items-center gap-2"
      role="complementary"
      aria-label="Logged-in user information"
    >
      {user.picture ? (
        <img
          src={user.picture}
          alt={displayName}
          className="rounded-circle"
          width="32"
          height="32"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div
          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-semibold"
          style={{ width: '32px', height: '32px', fontSize: '14px' }}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}
      <span
        className="d-none d-sm-inline text-body-secondary"
        aria-hidden="true"
      >
        {displayName}
      </span>
    </div>
  );
};
