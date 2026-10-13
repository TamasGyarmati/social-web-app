namespace SocialMedia.Logic.ReturnResults.UserResults;

public abstract record FollowResult
{
    public sealed record CannotFollowSelf(string Message) : FollowResult;
    public sealed record Followed(string Message) : FollowResult;
    public sealed record TargetUserNotFound(string Message) : FollowResult;
    public sealed record Unfollowed(string Message) : FollowResult;
}