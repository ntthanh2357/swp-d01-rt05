package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.Chat;
import com.swp391_g6.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySenderAndReceiverOrderByCreatedAtAsc(User sender, User receiver);
    
    @Query("SELECT c FROM Chat c WHERE (c.sender = ?1 AND c.receiver = ?2) OR (c.sender = ?2 AND c.receiver = ?1) ORDER BY c.createdAt ASC")
    List<Chat> findConversation(User user1, User user2);
    
    @Query("SELECT COUNT(c) FROM Chat c WHERE c.receiver = ?1 AND c.isRead = false")
    Long countUnreadMessages(User user);
    
    @Modifying
    @Transactional
    @Query("UPDATE Chat c SET c.isRead = true WHERE c.sender = ?1 AND c.receiver = ?2")
    void markAsRead(User sender, User receiver);
    
    @Query("SELECT DISTINCT c.sender FROM Chat c WHERE c.receiver = ?1")
    List<User> findDistinctSenders(User receiver);
    
    @Query("SELECT DISTINCT c.receiver FROM Chat c WHERE c.sender = ?1")
    List<User> findDistinctReceivers(User sender);
}