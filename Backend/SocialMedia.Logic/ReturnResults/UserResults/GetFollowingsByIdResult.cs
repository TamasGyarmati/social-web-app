using SocialMedia.Domain.Dtos;

namespace SocialMedia.Logic.ReturnResults.UserResults;

public abstract record GetFollowingsByIdResult
{
    public sealed record UserNotFound(string Message) : GetFollowingsByIdResult;
    public sealed record Success(List<GetFollowingsByIdResponseDto> Followings) : GetFollowingsByIdResult;
}