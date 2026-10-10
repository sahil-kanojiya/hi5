package com.app.hi5.utility.enums;

import lombok.Getter;

@Getter
public enum FileType {
    USER_PROFILE_IMAGE("user/profileImage"),
    USER_COVER_IMAGE("user/coverImage"),
    POST_IMAGE("post/image"),
    POST_VIDEO("post/video"),
    STORY_IMAGE("story/image"),
    STORY_VIDEO("story/video"),
    REEL_VIDEO("reel/video"),
    CHAT_IMAGE("chat/image"),
    CHAT_VIDEO("chat/video");

    private final String directory;

    FileType(String directory) {
        this.directory = directory;
    }
}
