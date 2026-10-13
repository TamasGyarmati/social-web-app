using SocialMedia.Domain.Dtos;

namespace SocialMedia.Logic.ReturnResults.UserResults;

public abstract record GetFollowersByIdResult
{
    public sealed record UserNotFound(string Message) : GetFollowersByIdResult;
    public sealed record Success(List<GetFollowersByIdResponseDto> Followers) : GetFollowersByIdResult;
}